// ——————————————————————————————————————
//  SIMPLIFIED CGPA DASHBOARD
// ——————————————————————————————————————
let fullData = []
let filteredData = []
let sortState = []
let cgpaFilterType = "above" // 'above' or 'below'

// Branch mapping
const BRANCH_MAP = {
  1: "Civil Engineering",
  2: "Computer Science",
  3: "Electrical Engineering",
  4: "Electronics and Telecommunication Engineering",
  5: "Information Technology",
  6: "Mechanical Engineering",
}

// ——————————————————————————————————————
//  INITIALIZATION
// ——————————————————————————————————————
document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.setAttribute("data-theme", "dark")
  initializeEventListeners()
  loadData()

  setTimeout(() => {
    document.getElementById("loadingOverlay").style.display = "none"
  }, 500)
})

function initializeEventListeners() {
  // Data controls
  document.getElementById("searchInput").addEventListener("input", debounce(filterData, 300))
  document.getElementById("cgpaValue").addEventListener("input", debounce(filterData, 300))
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
  document.getElementById("loadingOverlay").style.display = "flex"

  Promise.all([
    fetch("all_year.json")
      .then((r) => (r.ok ? r.json() : []))
      .catch(() => []),
  ])
    .then(([allYearData]) => {
      fullData = processData(allYearData)
      filterData()

      setTimeout(() => {
        document.getElementById("loadingOverlay").style.display = "none"
      }, 500)
    })
    .catch((err) => {
      console.error("Error loading data:", err)
      showToast("Error loading data", "❌")
      fullData = []
      filterData()

      setTimeout(() => {
        document.getElementById("loadingOverlay").style.display = "none"
      }, 500)
    })
}

function processData(data) {
  return data.map((item) => {
    const rollNumber = item.roll_number || ""
    const year = getYearFromRollNumber(rollNumber)
    const branchCode = getBranchCodeFromRollNumber(rollNumber)
    const branch = BRANCH_MAP[branchCode] || "Unknown"
    const cgpa = safeParseFloat(item.cgpa)

    return {
      ...item,
      year: year,
      branch: branch,
      branchCode: branchCode,
      cgpa_valid: cgpa !== null,
      cgpa_numeric: cgpa || 0,
    }
  })
}

function getYearFromRollNumber(rollNumber) {
  const yearPrefix = rollNumber.substring(0, 3)
  switch (yearPrefix) {
    case "240":
      return "First Year"
    case "230":
      return "Second Year"
    case "220":
      return "Third Year"
    case "210":
      return "Final Year"
    default:
      return "Unknown Year"
  }
}

function getBranchCodeFromRollNumber(rollNumber) {
  return rollNumber.charAt(3)
}

// ——————————————————————————————————————
//  FILTERING AND SEARCH
// ——————————————————————————————————————
function toggleCgpaFilter() {
  cgpaFilterType = cgpaFilterType === "above" ? "below" : "above"
  document.getElementById("cgpaToggle").textContent = cgpaFilterType === "above" ? "≥" : "≤"
  filterData()
}

function filterData() {
  const searchText = document.getElementById("searchInput").value.trim().toLowerCase()
  const cgpaInput = document.getElementById("cgpaValue").value.trim()

  filteredData = fullData.filter((item) => {
    const roll = (item.roll_number || "").toLowerCase()
    const name = (item.username || "").toLowerCase()
    const email = (item.email || "").toLowerCase()
    const branch = (item.branch || "").toLowerCase()

    const matchesSearch =
      searchText === "" ||
      roll.includes(searchText) ||
      name.includes(searchText) ||
      email.includes(searchText) ||
      branch.includes(searchText)

    let matchesCgpa = true
    if (cgpaInput !== "" && item.cgpa_valid) {
      const val = safeParseFloat(cgpaInput)
      if (val !== null) {
        matchesCgpa = cgpaFilterType === "above" ? item.cgpa_numeric >= val : item.cgpa_numeric <= val
      }
    }

    return matchesSearch && matchesCgpa
  })

  // Apply sorting
  if (sortState.length > 0) {
    filteredData.sort((a, b) => {
      for (const { col, ascending } of sortState) {
        let A = a[col] || ""
        let B = b[col] || ""

        if (col === "cgpa") {
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
  const validCgpaStudents = filteredData.filter((s) => s.cgpa_valid)
  const totalStudents = validCgpaStudents.length // Only count students with valid CGPA
  const validCgpas = validCgpaStudents.map((s) => s.cgpa_numeric)

  const avgCgpa = validCgpas.length > 0 ? validCgpas.reduce((a, b) => a + b, 0) / validCgpas.length : 0
  const aboveAverageCount = validCgpas.filter((cgpa) => cgpa > avgCgpa).length

  animateValue(document.getElementById("totalStudents"), 0, totalStudents, 800)
  animateValue(document.getElementById("averageCGPA"), 0, avgCgpa, 800, 3)
  animateValue(document.getElementById("excellentCount"), 0, aboveAverageCount, 800)

  document.getElementById("recordCount").textContent = `${totalStudents} record${totalStudents !== 1 ? "s" : ""}`
}

function updateBranchStatistics() {
  const branchStatsGrid = document.getElementById("branchStatsGrid")
  const branchStatsSection = document.getElementById("branchStatsSection")

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

  if (Object.keys(branchData).length === 0) {
    branchStatsSection.style.display = "none"
    return
  }

  branchStatsSection.style.display = "block"
  branchStatsGrid.innerHTML = ""

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

// ——————————————————————————————————————
//  ANIMATION FUNCTION
// ——————————————————————————————————————
function animateValue(element, start, end, duration, decimals = 0) {
  let startTimestamp = null
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp
    const progress = Math.min((timestamp - startTimestamp) / duration, 1)
    element.textContent = (start + progress * (end - start)).toFixed(decimals) || 0
    if (progress < 1) {
      window.requestAnimationFrame(step)
    }
  }
  window.requestAnimationFrame(step)
}
