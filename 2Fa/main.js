// Optimized CGPA Dashboard
let data = [], filtered = [], sorts = []
let cgpaMode = "above"

const BRANCHES = {
  1: "Civil", 2: "Computer Science", 3: "Electrical", 4: "Electronics & Telecom", 
  5: "Information Technology", 6: "Mechanical"
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.setAttribute("data-theme", "dark")
  
  // Event listeners
  document.getElementById("searchInput").addEventListener("input", debounce(filter, 300))
  document.getElementById("cgpaValue").addEventListener("input", debounce(filter, 300))
  document.getElementById("cgpaToggle").addEventListener("click", toggleCgpa)
  document.getElementById("resetBtn").addEventListener("click", reset)
  
  document.querySelectorAll("thead th[data-col]").forEach(th => 
    th.addEventListener("click", () => sort(th.getAttribute("data-col"))))
  
  loadData()
  setTimeout(() => document.getElementById("loadingOverlay").style.display = "none", 500)
})

// Utilities
const debounce = (fn, ms) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

const parseFloat = val => {
  const n = Number.parseFloat(val)
  return !isNaN(n) && isFinite(n) && n > 0 && n <= 10 ? n : null
}

const toast = (msg, icon = "✅") => {
  const t = document.getElementById("toast")
  t.querySelector(".toast-icon").textContent = icon
  t.querySelector(".toast-message").textContent = msg
  t.classList.add("show")
  setTimeout(() => t.classList.remove("show"), 3000)
}

// Data loading
const loadData = () => {
  fetch("http://127.0.0.1:5500/all_year.json")
    .then(r => r.ok ? r.json() : [])
    .then(d => {
      data = d.map(item => {
        const roll = item.roll_number || ""
        const year = roll.substring(0, 3)
        const branch = BRANCHES[roll.charAt(3)] || "Unknown"
        const cgpa = parseFloat(item.cgpa)
        
        return {
          ...item,
          year: {"240": "First", "230": "Second", "220": "Third", "210": "Final"}[year] || "Unknown",
          branch,
          cgpa_valid: cgpa !== null,
          cgpa_num: cgpa || 0
        }
      })
      filter()
    })
    .catch(() => {
      toast("Error loading data", "❌")
      data = []
      filter()
    })
}

// Filtering
const toggleCgpa = () => {
  cgpaMode = cgpaMode === "above" ? "below" : "above"
  document.getElementById("cgpaToggle").textContent = cgpaMode === "above" ? "≥" : "≤"
  filter()
}

const filter = () => {
  const search = document.getElementById("searchInput").value.toLowerCase()
  const cgpaVal = document.getElementById("cgpaValue").value.trim()
  
  filtered = data.filter(item => {
    const searchMatch = !search || 
      [item.roll_number, item.username, item.email, item.branch]
        .some(field => (field || "").toLowerCase().includes(search))
    
    let cgpaMatch = true
    if (cgpaVal && item.cgpa_valid) {
      const val = parseFloat(cgpaVal)
      if (val) cgpaMatch = cgpaMode === "above" ? item.cgpa_num >= val : item.cgpa_num <= val
    }
    
    return searchMatch && cgpaMatch
  })
  
  // Apply sorting
  if (sorts.length) {
    filtered.sort((a, b) => {
      for (const {col, asc} of sorts) {
        let A = a[col] || "", B = b[col] || ""
        
        if (col === "cgpa") {
          A = a.cgpa_valid ? a.cgpa_num : -1
          B = b.cgpa_valid ? b.cgpa_num : -1
        } else if (col === "roll_number") {
          A = parseFloat(A) || 0
          B = parseFloat(B) || 0
        } else {
          A = A.toString().toLowerCase()
          B = B.toString().toLowerCase()
        }
        
        if (A !== B) return (A < B ? -1 : 1) * (asc ? 1 : -1)
      }
      return 0
    })
  }
  
  display()
  updateStats()
}

const reset = () => {
  document.getElementById("searchInput").value = ""
  document.getElementById("cgpaValue").value = ""
  cgpaMode = "above"
  document.getElementById("cgpaToggle").textContent = "≥"
  sorts = []
  document.querySelectorAll(".sort-indicator").forEach(s => s.textContent = "")
  filter()
  toast("Filters reset", "🔄")
}

// Display
const display = () => {
  const tbody = document.getElementById("dataBody")
  tbody.innerHTML = ""
  
  filtered.forEach((item, i) => {
    const tr = document.createElement("tr")
    
    // Serial
    tr.appendChild(Object.assign(document.createElement("td"), {textContent: i + 1}))
    
    // Roll
    const rollTd = Object.assign(document.createElement("td"), {
      textContent: item.roll_number || "",
      className: "clickable",
      title: "Click to copy"
    })
    rollTd.onclick = () => copy(item.roll_number || "", "Roll number")
    tr.appendChild(rollTd)
    
    // Name
    const nameTd = Object.assign(document.createElement("td"), {
      textContent: item.username || "",
      className: "clickable", 
      title: "Click to copy custom format"
    })
    nameTd.onclick = () => {
      const name = (item.username || "").split(/\s+/)[0] || ""
      const formatted = (name ? name[0].toUpperCase() + name.slice(1).toLowerCase() : "") + 
                       "@" + (item.roll_number || "").slice(2).replace(/^0+/, "")
      copy(formatted, "Custom name")
    }
    tr.appendChild(nameTd)
    
    // Email
    const emailTd = Object.assign(document.createElement("td"), {
      textContent: item.email || "",
      className: "clickable",
      title: "Click to copy"
    })
    emailTd.onclick = () => copy(item.email || "", "Email")
    tr.appendChild(emailTd)
    
    // CGPA
    const cgpaTd = document.createElement("td")
    const badge = document.createElement("span")
    badge.className = "cgpa-badge"
    
    if (item.cgpa_valid) {
      const c = item.cgpa_num
      badge.textContent = c.toFixed(2)
      badge.classList.add(c >= 9 ? "cgpa-excellent" : c >= 7.5 ? "cgpa-good" : 
                         c >= 6 ? "cgpa-average" : "cgpa-below")
    } else {
      badge.textContent = item.cgpa || "N/A"
      badge.classList.add("cgpa-invalid")
    }
    cgpaTd.appendChild(badge)
    tr.appendChild(cgpaTd)
    
    // Branch
    const branchTd = document.createElement("td")
    const branchBadge = Object.assign(document.createElement("span"), {
      className: "branch-badge",
      textContent: item.branch
    })
    branchTd.appendChild(branchBadge)
    tr.appendChild(branchTd)
    
    tbody.appendChild(tr)
  })
}

// Statistics
const updateStats = () => {
  const valid = filtered.filter(s => s.cgpa_valid)
  const cgpas = valid.map(s => s.cgpa_num)
  const avg = cgpas.length ? cgpas.reduce((a, b) => a + b) / cgpas.length : 0
  
  animate(document.getElementById("totalStudents"), 0, valid.length, 800)
  animate(document.getElementById("averageCGPA"), 0, avg, 800, 3)
  animate(document.getElementById("excellentCount"), 0, cgpas.filter(c => c > avg).length, 800)
  
  document.getElementById("recordCount").textContent = 
    `${valid.length} record${valid.length !== 1 ? "s" : ""}`
}

// Sorting
const sort = col => {
  const idx = sorts.findIndex(s => s.col === col)
  if (idx >= 0) {
    sorts[idx].asc = !sorts[idx].asc
  } else {
    sorts.push({col, asc: true})
  }
  
  document.querySelectorAll(".sort-indicator").forEach(s => s.textContent = "")
  sorts.forEach(({col, asc}) => {
    const indicator = document.querySelector(`th[data-col="${col}"] .sort-indicator`)
    if (indicator) indicator.textContent = asc ? "▲" : "▼"
  })
  
  filter()
}

// Utilities
const copy = (text, type) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(() => toast(`${type} copied!`))
      .catch(() => toast("Copy failed", "❌"))
  } else {
    const textarea = Object.assign(document.createElement("textarea"), {
      value: text,
      style: "position:fixed"
    })
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand("copy")
      toast(`${type} copied!`)
    } catch {
      toast("Copy failed", "❌")
    }
    document.body.removeChild(textarea)
  }
}

const animate = (el, start, end, duration, decimals = 0) => {
  let startTime = null
  const step = time => {
    if (!startTime) startTime = time
    const progress = Math.min((time - startTime) / duration, 1)
    el.textContent = (start + progress * (end - start)).toFixed(decimals)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}