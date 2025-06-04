// ——————————————————————————————————————
//  SIMPLIFIED CGPA DASHBOARD
// ——————————————————————————————————————
let fullData = []
let filteredData = []
let sortState = []
let cgpaFilterType = "above" // 'above' or 'below'

// ——————————————————————————————————————
//  INITIALIZATION
// ——————————————————————————————————————
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme()
  initializeEventListeners()
  loadData()

  setTimeout(() => {
    document.getElementById("loadingOverlay").style.display = "none"
  }, 500)
})

function initializeTheme() {
  const savedTheme = localStorage.getItem("theme") || "light"
  document.documentElement.setAttribute("data-theme", savedTheme)
  updateThemeIcon(savedTheme)
}

function initializeEventListeners() {
  // Theme toggle
  document.getElementById("themeToggle").addEventListener("click", toggleTheme)

  // Data controls
  document.getElementById("fileSelector").addEventListener("change", loadData)
  document.getElementById("searchInput").addEventListener("input", debounce(filterData, 300))
  document.getElementById("cgpaValue").addEventListener("input", debounce(filterData, 300))
  document.getElementById("branchSelector").addEventListener("change", filterData)
  document.getElementById("cgpaToggle").addEventListener("click", toggleCgpaFilter)
  document.getElementById("resetBtn").addEventListener("click", resetFilters)

  // Table sorting
  document.querySelectorAll("thead th[data-col]").forEach((th) => {
    th.addEventListener("click", () => {
      const col = th.getAttribute("data-col")
      handleSortClick(col)
    })
  })
}

// ——————————————————————————————————————
//  THEME MANAGEMENT
// ——————————————————————————————————————
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme")
  const newTheme = currentTheme === "dark" ? "light" : "dark"

  document.documentElement.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
  updateThemeIcon(newTheme)
}

function updateThemeIcon(theme) {
  const icon = document.querySelector(".theme-icon")
  icon.textContent = theme === "dark" ? "☀️" : "🌙"
}

// ——————————————————————————————————————
//  UTILITY FUNCTIONS
// ——————————————————————————————————————
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function isValidNumber(value) {
  return !isNaN(value) && isFinite(value) && value !== null && value !== undefined && value > 0 && value <= 10
}

function safeParseFloat(value) {
  const parsed = Number.parseFloat(value)
  return isValidNumber(parsed) ? parsed : null
}

function showToast(message, icon = "✅") {
  const toast = document.getElementById("toast")
  const toastIcon = toast.querySelector(".toast-icon")
  const toastMessage = toast.querySelector(".toast-message")

  toastIcon.textContent = icon
  toastMessage.textContent = message

  toast.classList.add("show")
  setTimeout(() => {
    toast.classList.remove("show")
  }, 3000)
}

// ——————————————————————————————————————
//  DATA LOADING AND PROCESSING
// ——————————————————————————————————————
function loadData() {
  const file = document.getElementById("fileSelector").value
  document.getElementById("loadingOverlay").style.display = "flex"

  if (file === "all") {
    Promise.all([
      fetch("cgpa_fy.json")
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []),
      fetch("cgpa_sy.json")
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []),
      fetch("cgpa_ty.json")
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []),
    ])
      .then(([fy, sy, ty]) => {
        fullData = processData(fy.concat(sy, ty))
        processLoadedData()
      })
      .catch((err) => {
        console.error("Error loading data:", err)
        showToast("Error loading data", "❌")
        fullData = []
        processLoadedData()
      })
  } else {
    fetch(file)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        fullData = processData(data)
        processLoadedData()
      })
      .catch((err) => {
        console.error("Error loading data:", err)
        showToast("Error loading data", "❌")
        fullData = []
        processLoadedData()
      })
  }
}

function processData(data) {
  // Include ALL students, but mark those with invalid data
  return data
    .filter((item) => {
      // Only exclude if completely missing essential info
      return item.roll_number && item.username && item.email
    })
    .map((item) => {
      // Add validity flag for CGPA
      const cgpa = safeParseFloat(item.cgpa)
      return {
        ...item,
        cgpa_valid: cgpa !== null,
        cgpa_numeric: cgpa || 0,
      }
    })
}

function processLoadedData() {
  populateBranchFilter(fullData)
  filterData()

  setTimeout(() => {
    document.getElementById("loadingOverlay").style.display = "none"
  }, 500)
}

// ——————————————————————————————————————
//  FILTERING AND SEARCH
// ——————————————————————————————————————
function populateBranchFilter(data) {
  const branchSelector = document.getElementById("branchSelector")
  const branches = Array.from(new Set(data.map((d) => (d.branch || "").trim())))
    .filter((br) => br !== "")
    .sort()

  branchSelector.innerHTML = `<option value="">All Branches</option>`
  branches.forEach((branch) => {
    branchSelector.innerHTML += `<option value="${branch}">${branch}</option>`
  })
}

function toggleCgpaFilter() {
  cgpaFilterType = cgpaFilterType === "above" ? "below" : "above"
  document.getElementById("cgpaToggle").textContent = cgpaFilterType === "above" ? "≥" : "≤"
  filterData()
}

function filterData() {
  const searchText = document.getElementById("searchInput").value.trim().toLowerCase()
  const cgpaInput = document.getElementById("cgpaValue").value.trim()
  const branchFilter = document.getElementById("branchSelector").value.toLowerCase()

  filteredData = fullData.filter((item) => {
    const roll = (item.roll_number || "").toLowerCase()
    const name = (item.username || "").toLowerCase()
    const email = (item.email || "").toLowerCase()
    const branch = (item.branch || "").toLowerCase()

    // Text search - include ALL students
    const matchesSearch =
      searchText === "" ||
      roll.includes(searchText) ||
      name.includes(searchText) ||
      email.includes(searchText) ||
      branch.includes(searchText)

    // Branch filter - include ALL students
    const matchesBranch = branchFilter === "" || branch === branchFilter

    // CGPA filter - only apply to students with valid CGPA
    let matchesCgpa = true
    if (cgpaInput !== "" && item.cgpa_valid) {
      const val = safeParseFloat(cgpaInput)
      if (val !== null) {
        matchesCgpa = cgpaFilterType === "above" ? item.cgpa_numeric >= val : item.cgpa_numeric <= val
      }
    }
    // If CGPA is invalid, include in results but not in CGPA filtering
    if (cgpaInput !== "" && !item.cgpa_valid) {
      matchesCgpa = true // Include invalid CGPA students in search results
    }

    return matchesSearch && matchesBranch && matchesCgpa
  })

  // Apply sorting
  if (sortState.length > 0) {
    filteredData.sort((a, b) => {
      for (const { col, ascending } of sortState) {
        let A = a[col] || ""
        let B = b[col] || ""

        if (col === "cgpa") {
          // Sort by numeric CGPA, put invalid ones at the end
          A = a.cgpa_valid ? a.cgpa_numeric : -1
          B = b.cgpa_valid ? b.cgpa_numeric : -1
        } else if (col === "roll_number") {
          A = safeParseFloat(A) || 0
          B = safeParseFloat(B) || 0
        } else {
          A = A.toString().toLowerCase()
          B = B.toString().toLowerCase()
        }

        if (A < B) return ascending ? -1 : 1
        if (A > B) return ascending ? 1 : -1
      }
      return 0
    })
  }

  displayData()
  updateStatistics()
  updateBranchStatistics()
}

function resetFilters() {
  document.getElementById("searchInput").value = ""
  document.getElementById("cgpaValue").value = ""
  document.getElementById("branchSelector").value = ""
  cgpaFilterType = "above"
  document.getElementById("cgpaToggle").textContent = "≥"

  sortState = []
  clearAllSortIndicators()
  filterData()

  showToast("Filters reset", "🔄")
}

// ——————————————————————————————————————
//  STATISTICS
// ——————————————————————————————————————
function updateStatistics() {
  const totalStudents = filteredData.length // Include ALL students in count
  const validCgpaStudents = filteredData.filter((s) => s.cgpa_valid)
  const validCgpas = validCgpaStudents.map((s) => s.cgpa_numeric)

  // Calculate average with full precision using only valid CGPAs
  const avgCgpa = validCgpas.length > 0 ? validCgpas.reduce((a, b) => a + b, 0) / validCgpas.length : 0

  // Count students above average (only among those with valid CGPA)
  const aboveAverageCount = validCgpas.filter((cgpa) => cgpa > avgCgpa).length

  // Update display with smooth animation
  animateValue(document.getElementById("totalStudents"), 0, totalStudents, 800)
  animateValue(document.getElementById("averageCGPA"), 0, avgCgpa, 800, 3)
  animateValue(document.getElementById("excellentCount"), 0, aboveAverageCount, 800)

  // Update record count
  document.getElementById("recordCount").textContent = `${totalStudents} record${totalStudents !== 1 ? "s" : ""}`
}

function updateBranchStatistics() {
  const branchStatsGrid = document.getElementById("branchStatsGrid")
  const branchStatsSection = document.getElementById("branchStatsSection")

  // Group data by branch - include ALL students
  const branchData = {}
  filteredData.forEach((student) => {
    const branch = student.branch || "Unknown"
    if (!branchData[branch]) {
      branchData[branch] = { all: [], valid: [] }
    }
    branchData[branch].all.push(student)
    if (student.cgpa_valid) {
      branchData[branch].valid.push(student.cgpa_numeric)
    }
  })

  // Hide section if no data
  if (Object.keys(branchData).length === 0) {
    branchStatsSection.style.display = "none"
    return
  }

  branchStatsSection.style.display = "block"
  branchStatsGrid.innerHTML = ""

  // Create cards for each branch
  Object.keys(branchData)
    .sort()
    .forEach((branch) => {
      const { all, valid } = branchData[branch]
      const totalCount = all.length
      const validCount = valid.length

      let avgCgpa = 0
      let maxCgpa = 0
      let minCgpa = 0

      if (validCount > 0) {
        avgCgpa = valid.reduce((a, b) => a + b, 0) / validCount
        maxCgpa = Math.max(...valid)
        minCgpa = Math.min(...valid)
      }

      const card = document.createElement("div")
      card.className = "branch-stat-card"
      card.innerHTML = `
      <div class="branch-name">${branch}</div>
      <div class="branch-metrics">
        <span>Total: ${totalCount}</span>
        <span>Valid: ${validCount}</span>
        <span>Avg: ${validCount > 0 ? avgCgpa.toFixed(3) : "N/A"}</span>
        <span>Range: ${validCount > 0 ? `${minCgpa.toFixed(1)}-${maxCgpa.toFixed(1)}` : "N/A"}</span>
      </div>
    `

      branchStatsGrid.appendChild(card)
    })
}

function animateValue(element, start, end, duration = 1000, decimals = 0) {
  const startTime = performance.now()
  const difference = end - start

  function updateValue(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const current = start + difference * progress

    element.textContent = decimals > 0 ? current.toFixed(decimals) : Math.round(current)

    if (progress < 1) {
      requestAnimationFrame(updateValue)
    }
  }

  requestAnimationFrame(updateValue)
}

// ——————————————————————————————————————
//  TABLE DISPLAY
// ——————————————————————————————————————
function displayData() {
  const tbody = document.getElementById("dataBody")
  tbody.innerHTML = ""

  const fragment = document.createDocumentFragment()

  filteredData.forEach((item, idx) => {
    const tr = document.createElement("tr")

    // Serial number
    const tdSerial = document.createElement("td")
    tdSerial.textContent = idx + 1
    tr.appendChild(tdSerial)

    // Roll number
    const tdRoll = document.createElement("td")
    tdRoll.textContent = item.roll_number || ""
    tdRoll.classList.add("clickable")
    tdRoll.title = "Click to copy"
    tdRoll.addEventListener("click", () => {
      copyToClipboard(item.roll_number || "", "Roll number")
    })
    tr.appendChild(tdRoll)

    // Name
    const tdName = document.createElement("td")
    tdName.textContent = item.username || ""
    tdName.classList.add("clickable")
    tdName.title = "Click to copy custom format"
    tdName.addEventListener("click", () => {
      const customName = buildCustomName(item.username || "", item.roll_number || "")
      copyToClipboard(customName, "Custom name")
    })
    tr.appendChild(tdName)

    // Email
    const tdEmail = document.createElement("td")
    tdEmail.textContent = item.email || ""
    tdEmail.classList.add("clickable")
    tdEmail.title = "Click to copy"
    tdEmail.addEventListener("click", () => {
      copyToClipboard(item.email || "", "Email")
    })
    tr.appendChild(tdEmail)

    // CGPA with badge
    const tdCgpa = document.createElement("td")
    const cgpaBadge = document.createElement("span")
    cgpaBadge.className = "cgpa-badge"

    if (item.cgpa_valid) {
      const cgpaNum = item.cgpa_numeric
      cgpaBadge.textContent = cgpaNum.toFixed(2)

      if (cgpaNum >= 9.0) {
        cgpaBadge.classList.add("cgpa-excellent")
      } else if (cgpaNum >= 7.5) {
        cgpaBadge.classList.add("cgpa-good")
      } else if (cgpaNum >= 6.0) {
        cgpaBadge.classList.add("cgpa-average")
      } else {
        cgpaBadge.classList.add("cgpa-below")
      }
    } else {
      cgpaBadge.textContent = item.cgpa || "N/A"
      cgpaBadge.classList.add("cgpa-invalid")
    }

    tdCgpa.appendChild(cgpaBadge)
    tr.appendChild(tdCgpa)

    // Branch
    const tdBranch = document.createElement("td")
    const branchBadge = document.createElement("span")
    branchBadge.className = "branch-badge"
    branchBadge.textContent = item.branch || "Unknown"
    tdBranch.appendChild(branchBadge)
    tr.appendChild(tdBranch)

    fragment.appendChild(tr)
  })

  tbody.appendChild(fragment)
}

// ——————————————————————————————————————
//  SORTING
// ——————————————————————————————————————
function handleSortClick(col) {
  const existingIndex = sortState.findIndex((obj) => obj.col === col)
  if (existingIndex >= 0) {
    sortState[existingIndex].ascending = !sortState[existingIndex].ascending
  } else {
    sortState.push({ col: col, ascending: true })
  }

  updateSortIndicators()
  filterData()
}

function updateSortIndicators() {
  document.querySelectorAll("thead th .sort-indicator").forEach((span) => {
    span.textContent = ""
  })

  sortState.forEach(({ col, ascending }) => {
    const th = document.querySelector(`thead th[data-col="${col}"]`)
    if (!th) return
    const span = th.querySelector(".sort-indicator")
    span.textContent = ascending ? "▲" : "▼"
  })
}

function clearAllSortIndicators() {
  sortState = []
  document.querySelectorAll("thead th .sort-indicator").forEach((span) => {
    span.textContent = ""
  })
}

// ——————————————————————————————————————
//  UTILITY FUNCTIONS
// ——————————————————————————————————————
function buildCustomName(fullName, rollNumber) {
  let firstToken = fullName.trim().split(/\s+/)[0] || ""
  if (firstToken.length > 0) {
    firstToken = firstToken[0].toUpperCase() + firstToken.slice(1).toLowerCase()
  }

  let remainder = rollNumber.slice(2)
  remainder = remainder.replace(/^0+/, "")

  return firstToken + "@" + (remainder || "")
}

function copyToClipboard(str, type) {
  if (!navigator.clipboard) {
    // Fallback
    const textarea = document.createElement("textarea")
    textarea.value = str
    textarea.style.position = "fixed"
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    try {
      document.execCommand("copy")
      showToast(`${type} copied!`)
    } catch (err) {
      showToast("Copy failed", "❌")
    }
    document.body.removeChild(textarea)
    return
  }

  navigator.clipboard
    .writeText(str)
    .then(() => showToast(`${type} copied!`))
    .catch(() => showToast("Copy failed", "❌"))
}
