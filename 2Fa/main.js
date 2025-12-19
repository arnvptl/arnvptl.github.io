// Optimized CGPA Dashboard — UPDATED FOR NEW JSON SCHEMA

let data = [], filtered = [], sorts = []
let cgpaMode = "above"

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.setAttribute("data-theme", "dark")

  document.getElementById("searchInput").addEventListener("input", debounce(filter, 300))
  document.getElementById("cgpaValue").addEventListener("input", debounce(filter, 300))
  document.getElementById("cgpaToggle").addEventListener("click", toggleCgpa)
  document.getElementById("resetBtn").addEventListener("click", reset)

  document.querySelectorAll("thead th[data-col]").forEach(th =>
    th.addEventListener("click", () => sort(th.getAttribute("data-col")))
  )

  loadData()
  setTimeout(() => document.getElementById("loadingOverlay").style.display = "none", 500)
})

// ---------------- Utilities ----------------

const debounce = (fn, ms) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
}

const parseCGPA = val => {
  if (typeof val !== "string") return null
  const n = Number.parseFloat(val.trim())
  return !isNaN(n) && n > 0 && n <= 10 ? n : null
}

const toast = (msg, icon = "✅") => {
  const t = document.getElementById("toast")
  t.querySelector(".toast-icon").textContent = icon
  t.querySelector(".toast-message").textContent = msg
  t.classList.add("show")
  setTimeout(() => t.classList.remove("show"), 3000)
}

// ---------------- Data Loading ----------------

const loadData = () => {
  fetch("http://127.0.0.1:5500/all_year.json")
    .then(r => r.ok ? r.json() : [])
    .then(d => {
      data = d.map(item => {
        const usn = item.usn || ""
        const yearCode = usn.substring(0, 3)

        const cgpaNum = parseCGPA(item.cgpa)

        return {
          ...item,
          year: { "240": "First", "230": "Second", "220": "Third", "210": "Final" }[yearCode] || "Unknown",
          branch: item.branch || "Unknown",
          cgpa_valid: cgpaNum !== null,
          cgpa_num: cgpaNum || 0
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

// ---------------- Filtering ----------------

const toggleCgpa = () => {
  cgpaMode = cgpaMode === "above" ? "below" : "above"
  document.getElementById("cgpaToggle").textContent = cgpaMode === "above" ? "≥" : "≤"
  filter()
}

const filter = () => {
  const search = document.getElementById("searchInput").value.toLowerCase()
  const cgpaVal = document.getElementById("cgpaValue").value.trim()
  const cgpaFilter = parseCGPA(cgpaVal)

  filtered = data.filter(item => {
    const searchMatch =
      !search ||
      [item.usn, item.name, item.email, item.branch]
        .some(f => (f || "").toLowerCase().includes(search))

    let cgpaMatch = true
    if (cgpaFilter !== null && item.cgpa_valid) {
      cgpaMatch = cgpaMode === "above"
        ? item.cgpa_num >= cgpaFilter
        : item.cgpa_num <= cgpaFilter
    }

    return searchMatch && cgpaMatch
  })

  if (sorts.length) {
    filtered.sort((a, b) => {
      for (const { col, asc } of sorts) {
        let A = a[col] || "", B = b[col] || ""

        if (col === "cgpa") {
          A = a.cgpa_valid ? a.cgpa_num : -1
          B = b.cgpa_valid ? b.cgpa_num : -1
        } else if (col === "usn") {
          A = Number(A) || 0
          B = Number(B) || 0
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

// ---------------- Reset ----------------

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

// ---------------- Display ----------------

const display = () => {
  const tbody = document.getElementById("dataBody")
  tbody.innerHTML = ""

  filtered.forEach((item, i) => {
    const tr = document.createElement("tr")

    tr.appendChild(Object.assign(document.createElement("td"), { textContent: i + 1 }))

    const usnTd = Object.assign(document.createElement("td"), {
      textContent: item.usn || "",
      className: "clickable",
      title: "Click to copy"
    })
    usnTd.onclick = () => copy(item.usn || "", "USN")
    tr.appendChild(usnTd)

    const nameTd = Object.assign(document.createElement("td"), {
      textContent: item.name || "",
      className: "clickable",
      title: "Click to copy"
    })
    nameTd.onclick = () => copy(item.name || "", "Name")
    tr.appendChild(nameTd)

    const emailTd = Object.assign(document.createElement("td"), {
      textContent: item.email || "",
      className: "clickable",
      title: "Click to copy"
    })
    emailTd.onclick = () => copy(item.email || "", "Email")
    tr.appendChild(emailTd)

    const cgpaTd = document.createElement("td")
    const badge = document.createElement("span")
    badge.className = "cgpa-badge"

    if (item.cgpa_valid) {
      const c = item.cgpa_num
      badge.textContent = c.toFixed(2)
      badge.classList.add(
        c >= 9 ? "cgpa-excellent" :
        c >= 7.5 ? "cgpa-good" :
        c >= 6 ? "cgpa-average" : "cgpa-below"
      )
    } else {
      badge.textContent = "N/A"
      badge.classList.add("cgpa-invalid")
    }

    cgpaTd.appendChild(badge)
    tr.appendChild(cgpaTd)

    const branchTd = document.createElement("td")
    branchTd.appendChild(Object.assign(document.createElement("span"), {
      className: "branch-badge",
      textContent: item.branch
    }))
    tr.appendChild(branchTd)

    tbody.appendChild(tr)
  })
}

// ---------------- Stats ----------------

const updateStats = () => {
  const valid = filtered.filter(s => s.cgpa_valid)
  const cgpas = valid.map(s => s.cgpa_num)
  const avg = cgpas.length ? cgpas.reduce((a, b) => a + b) / cgpas.length : 0

  animate(document.getElementById("totalStudents"), 0, valid.length, 800)
  animate(document.getElementById("averageCGPA"), 0, avg, 800, 2)
  animate(document.getElementById("excellentCount"), 0, cgpas.filter(c => c > avg).length, 800)

  document.getElementById("recordCount").textContent =
    `${valid.length} record${valid.length !== 1 ? "s" : ""}`
}

// ---------------- Sorting ----------------

const sort = col => {
  const idx = sorts.findIndex(s => s.col === col)
  if (idx >= 0) sorts[idx].asc = !sorts[idx].asc
  else sorts.push({ col, asc: true })

  document.querySelectorAll(".sort-indicator").forEach(s => s.textContent = "")
  sorts.forEach(({ col, asc }) => {
    const el = document.querySelector(`th[data-col="${col}"] .sort-indicator`)
    if (el) el.textContent = asc ? "▲" : "▼"
  })

  filter()
}

// ---------------- Clipboard + Animation ----------------

const copy = (text, type) => {
  navigator.clipboard.writeText(text)
    .then(() => toast(`${type} copied!`))
    .catch(() => toast("Copy failed", "❌"))
}

const animate = (el, start, end, duration, decimals = 0) => {
  let startTime = null
  const step = time => {
    if (!startTime) startTime = time
    const p = Math.min((time - startTime) / duration, 1)
    el.textContent = (start + p * (end - start)).toFixed(decimals)
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
