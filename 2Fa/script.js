const SECRET = "BOOBIESBOOBIESBOOBIESBOOBIESLOLZ42";

// Optimized base32 decoder
const base32ToBytes = s => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '', bytes = [];
    
    for (let c of s.toUpperCase()) {
        const val = chars.indexOf(c);
        if (val !== -1) bits += val.toString(2).padStart(5, '0');
    }
    
    for (let i = 0; i < bits.length - 7; i += 8) {
        bytes.push(parseInt(bits.slice(i, i + 8), 2));
    }
    return new Uint8Array(bytes);
};

// Generate TOTP with time offset
const generateTOTP = async (offset = 0) => {
    const time = Math.floor(Date.now() / 30000) + offset;
    const timeBytes = new ArrayBuffer(8);
    new DataView(timeBytes).setBigUint64(0, BigInt(time));
    
    const key = await crypto.subtle.importKey('raw', base32ToBytes(SECRET), 
        { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
    
    const hmac = new Uint8Array(await crypto.subtle.sign('HMAC', key, timeBytes));
    const offset_val = hmac[19] & 0xf;
    
    const code = ((hmac[offset_val] & 0x7f) << 24 | 
                  (hmac[offset_val + 1] & 0xff) << 16 |
                  (hmac[offset_val + 2] & 0xff) << 8 |
                  (hmac[offset_val + 3] & 0xff)) % 1000000;
    
    return code.toString().padStart(6, '0');
};

// Verify code against current and previous time windows
const verifyCode = async code => {
    const [current, previous] = await Promise.all([generateTOTP(0), generateTOTP(-1)]);
    const entered = code.trim();
    return entered === current || entered === previous;
};

// Show message helper
const showMessage = (msg, type) => {
    const el = document.getElementById('message');
    el.textContent = msg;
    el.className = type;
};

// Create dashboard page as blob URL
const createDashboard = () => URL.createObjectURL(new Blob([`<!DOCTYPE html>
<html><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CGPA Analytics Dashboard</title>
    <link rel="stylesheet" href="https://rnv.is-a.dev/2Fa/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head><body>
    <div id="loadingOverlay" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>Loading dashboard...</p>
    </div>
    <div class="container">
        <header class="header">
            <div class="header-content">
                <div class="header-left">
                    <h1>CGPA Analytics Dashboard</h1>
                    <p>Comprehensive student performance insights</p>
                </div>
            </div>
        </header>
        <section class="stats-grid">
            <div class="stat-card">
                <div class="stat-content">
                    <div class="stat-value" id="totalStudents">0</div>
                    <div class="stat-label">Total Students</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-content">
                    <div class="stat-value" id="averageCGPA">0.000</div>
                    <div class="stat-label">Average CGPA</div>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-content">
                    <div class="stat-value" id="excellentCount">0</div>
                    <div class="stat-label">Above Average</div>
                </div>
            </div>
        </section>
        <section class="filters-modern">
            <div class="filter-row">
                <div class="filter-item search-item">
                    <input type="text" id="searchInput" placeholder="Search students..." class="search-input">
                    <span class="search-icon">🔎︎</span>
                </div>
                <div class="filter-item cgpa-filter">
                    <button id="cgpaToggle" class="cgpa-toggle" title="Toggle filter type">≥</button>
                    <input type="number" id="cgpaValue" placeholder="CGPA" step="0.001" class="cgpa-input">
                </div>
                <button id="resetBtn" class="reset-btn" title="Reset filters">↺</button>
            </div>
        </section>
        <section class="table-section">
            <div class="table-header">
                <h3>Student Records</h3>
                <span id="recordCount">0 records</span>
            </div>
            <div class="table-wrapper">
                <table id="dataTable">
                    <thead>
                        <tr>
                            <th data-col="serial" class="sortable"># <span class="sort-indicator"></span></th>
                            <th data-col="roll_number" class="sortable">Roll No <span class="sort-indicator"></span></th>
                            <th data-col="username" class="sortable">Name <span class="sort-indicator"></span></th>
                            <th data-col="email" class="sortable">Email <span class="sort-indicator"></span></th>
                            <th data-col="cgpa" class="sortable">CGPA <span class="sort-indicator"></span></th>
                            <th data-col="branch" class="sortable">Branch <span class="sort-indicator"></span></th>
                        </tr>
                    </thead>
                    <tbody id="dataBody"></tbody>
                </table>
            </div>
        </section>
        <section class="branch-stats-section" id="branchStatsSection">
            <h3>Branch Statistics</h3>
            <div class="branch-stats-grid" id="branchStatsGrid"></div>
        </section>
        <section class="quick-links">
            <div class="links-row">
                <a href="https://witresults.contineo.in:7074/" target="_blank" class="link-item">Results</a>
                <a href="http://103.117.208.18/moodle/" target="_blank" class="link-item">Moodle-1</a>
                <a href="http://103.117.208.19/moodle/" target="_blank" class="link-item">Moodle-2</a>
            </div>
        </section>
    </div>
    <div id="toast" class="toast">
        <div class="toast-content">
            <span class="toast-icon">✅</span>
            <span class="toast-message">Copied to clipboard!</span>
        </div>
    </div>
    <script src="https://rnv.is-a.dev/2Fa/main.js"></script>
    <script disable-devtool-auto src='https://cdn.jsdelivr.net/npm/disable-devtool' disable-select='true'></script>
</body></html>`], { type: 'text/html' }));

// Handle login
const handleLogin = async () => {
    const code = document.getElementById('code').value.trim();
    
    if (code.length !== 6) {
        showMessage('Please enter a 6-digit code', 'error');
        return;
    }

    try {
        if (await verifyCode(code)) {
            showMessage('Login successful!', 'success');
            setTimeout(() => window.location.href = createDashboard(), 1000);
        } else {
            showMessage('Invalid code', 'error');
            document.getElementById('code').value = '';
            document.getElementById('code').focus();
        }
    } catch (error) {
        showMessage('Invalid code', 'error');
        document.getElementById('code').value = '';
        document.getElementById('code').focus();
    }
};

// Event listeners
const codeInput = document.getElementById('code');
codeInput.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g, '');
    if (e.target.value.length === 6) handleLogin();
});
codeInput.addEventListener('keypress', e => e.key === 'Enter' && handleLogin());
