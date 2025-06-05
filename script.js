// DOM Elements
const form = document.getElementById("message-form")
const textarea = document.getElementById("message-input")
const submitBtn = document.getElementById("submit-btn")
const statusMessage = document.getElementById("status-message")
const charCount = document.getElementById("char-count")

// Character counter
textarea.addEventListener("input", function () {
  const count = this.value.length
  charCount.textContent = count

  // Change color based on length
  if (count < 10) {
    charCount.style.color = "#dc3545"
  } else if (count > 500) {
    charCount.style.color = "#fd7e14"
  } else {
    charCount.style.color = "#28a745"
  }
})

// Form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const message = textarea.value.trim()

  if (message.length < 10) {
    showStatus("Message must be at least 10 characters long.", "error")
    return
  }

  // Show loading state
  submitBtn.disabled = true
  submitBtn.classList.add("loading")
  submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Sending...'
  showStatus("Sending your message...", "loading")

  try {
    const response = await fetch("https://formsubmit.co/19905386412a5732d8e2efe33df648e3", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        message: message,
        timestamp: new Date().toISOString(),
      }),
    })

    if (response.ok) {
      showStatus("Message sent successfully! I'll respond through my Instagram stories.", "success")
      textarea.value = ""
      charCount.textContent = "0"
      charCount.style.color = "#dc3545"
    } else {
      throw new Error("Failed to send message")
    }
  } catch (error) {
    console.error("Error:", error)
    showStatus("Failed to send message. Please try again later.", "error")
  } finally {
    // Reset button state
    submitBtn.disabled = false
    submitBtn.classList.remove("loading")
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message'
  }
})

// Show status message
function showStatus(message, type) {
  statusMessage.textContent = message
  statusMessage.className = `status-message ${type}`
  statusMessage.style.display = "block"

  // Auto-hide success/error messages after 5 seconds
  if (type !== "loading") {
    setTimeout(() => {
      statusMessage.style.display = "none"
    }, 5000)
  }
}

// Animated title
const titleFrames = ["riprnv", "riprn", "ripr", "rip", "ri", "r", "ri", "rip", "ripr", "riprn"]

let titleIndex = 0
setInterval(() => {
  document.title = titleFrames[titleIndex % titleFrames.length]
  titleIndex++
}, 400)

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = "smooth"

// Profile image error handling
const profileImg = document.getElementById("profile-img")
profileImg.addEventListener("error", function () {
  this.src =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiBmaWxsPSIjZjBmMGYwIi8+CjxjaXJjbGUgY3g9IjYwIiBjeT0iNDUiIHI9IjIwIiBmaWxsPSIjY2NjIi8+CjxwYXRoIGQ9Ik0yMCA5NWMwLTIyIDIwLTQwIDQwLTQwczQwIDE4IDQwIDQwIiBmaWxsPSIjY2NjIi8+Cjwvc3ZnPg=="
})

// Add entrance animations
window.addEventListener("load", () => {
  const elements = document.querySelectorAll(".profile-section, .social-link, .message-section")
  elements.forEach((el, index) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(20px)"

    setTimeout(() => {
      el.style.transition = "all 0.6s ease"
      el.style.opacity = "1"
      el.style.transform = "translateY(0)"
    }, index * 100)
  })
})
