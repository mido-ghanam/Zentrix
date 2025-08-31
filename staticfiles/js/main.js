// Main JavaScript functionality
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initializeNavigation()
  initializeDarkMode()
  initializeCharts()
  initializePasswordStrength()
  initializeTooltips()
  initializeAnimations()
})

// Navigation functionality
function initializeNavigation() {
  // Mobile menu toggle
  const mobileMenuButton = document.getElementById("mobile-menu-button")
  const mobileMenu = document.getElementById("mobile-menu")

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden")

      // Animate menu icon
      const icon = mobileMenuButton.querySelector("i")
      if (mobileMenu.classList.contains("hidden")) {
        icon.className = "fas fa-bars text-xl"
      } else {
        icon.className = "fas fa-times text-xl"
      }
    })
  }

  // User menu toggle
  const userMenuButton = document.querySelector(".user-menu-button")
  const userMenu = document.querySelector(".user-menu")

  if (userMenuButton && userMenu) {
    userMenuButton.addEventListener("click", (e) => {
      e.stopPropagation()
      userMenu.classList.toggle("hidden")
    })

    // Close menu when clicking outside
    document.addEventListener("click", () => {
      userMenu.classList.add("hidden")
    })
  }

  // Active navigation highlighting
  const currentPath = window.location.pathname
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link")

  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active")
    }
  })
}

// Dark mode functionality
function initializeDarkMode() {
  const darkModeToggle = document.getElementById("darkModeToggle")
  const htmlRoot = document.getElementById("html-root")

  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem("theme") || "light"

  if (savedTheme === "dark") {
    htmlRoot.classList.add("dark")
    document.body.classList.add("dark")
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      const isDark = htmlRoot.classList.contains("dark")

      if (isDark) {
        htmlRoot.classList.remove("dark")
        document.body.classList.remove("dark")
        localStorage.setItem("theme", "light")
      } else {
        htmlRoot.classList.add("dark")
        document.body.classList.add("dark")
        localStorage.setItem("theme", "dark")
      }

      // Add transition effect
      document.body.style.transition = "all 0.3s ease"
      setTimeout(() => {
        document.body.style.transition = ""
      }, 300)
    })
  }
}

// Chart initialization
function initializeCharts() {
  // Load Chart.js if not already loaded
  if (typeof window.Chart === "undefined") {
    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/npm/chart.js"
    script.onload = () => {
      createCharts()
    }
    document.head.appendChild(script)
  } else {
    createCharts()
  }
}

function createCharts() {
  // Threats chart
  const threatsChart = document.getElementById("threatsChart")
  if (threatsChart) {
    const ctx = threatsChart.getContext("2d")
    new window.Chart(ctx, {
      type: "line",
      data: {
        labels: ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"],
        datasets: [
          {
            label: "التهديدات",
            data: [12, 19, 8, 15, 7, 23, 14],
            borderColor: "#ef4444",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(156, 163, 175, 0.1)",
            },
          },
          x: {
            grid: {
              color: "rgba(156, 163, 175, 0.1)",
            },
          },
        },
      },
    })
  }
}

// Password strength indicator
function initializePasswordStrength() {
  const passwordInputs = document.querySelectorAll('input[type="password"]')

  passwordInputs.forEach((input) => {
    if (input.id === "password1" || input.id === "password") {
      input.addEventListener("input", function () {
        const strength = calculatePasswordStrength(this.value)
        updatePasswordStrengthUI(strength)
      })
    }
  })
}

function calculatePasswordStrength(password) {
  let score = 0

  // Length check
  if (password.length >= 8) score += 25
  if (password.length >= 12) score += 25

  // Character variety checks
  if (/[a-z]/.test(password)) score += 10
  if (/[A-Z]/.test(password)) score += 10
  if (/[0-9]/.test(password)) score += 10
  if (/[^A-Za-z0-9]/.test(password)) score += 20

  return Math.min(score, 100)
}

function updatePasswordStrengthUI(strength) {
  const strengthBar = document.getElementById("strength-bar")
  if (!strengthBar) return

  strengthBar.style.width = strength + "%"

  // Remove existing classes
  strengthBar.classList.remove("weak", "fair", "good", "strong")

  // Add appropriate class
  if (strength < 30) {
    strengthBar.classList.add("weak")
  } else if (strength < 60) {
    strengthBar.classList.add("fair")
  } else if (strength < 90) {
    strengthBar.classList.add("good")
  } else {
    strengthBar.classList.add("strong")
  }
}

// Password visibility toggle
function togglePassword(inputId) {
  const input = document.getElementById(inputId)
  const toggle = document.getElementById(inputId + "-toggle")

  if (input.type === "password") {
    input.type = "text"
    toggle.className = "fas fa-eye-slash text-gray-400 hover:text-gray-600"
  } else {
    input.type = "password"
    toggle.className = "fas fa-eye text-gray-400 hover:text-gray-600"
  }
}

// Tooltip functionality
function initializeTooltips() {
  const tooltipElements = document.querySelectorAll("[data-tooltip]")

  tooltipElements.forEach((element) => {
    element.addEventListener("mouseenter", showTooltip)
    element.addEventListener("mouseleave", hideTooltip)
  })
}

function showTooltip(e) {
  const tooltip = document.createElement("div")
  tooltip.className = "tooltip"
  tooltip.textContent = e.target.getAttribute("data-tooltip")

  document.body.appendChild(tooltip)

  const rect = e.target.getBoundingClientRect()
  tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px"
  tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + "px"
}

function hideTooltip() {
  const tooltip = document.querySelector(".tooltip")
  if (tooltip) {
    tooltip.remove()
  }
}

// Animation on scroll
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in")
      }
    })
  }, observerOptions)

  // Observe all cards and stat cards
  const animatedElements = document.querySelectorAll(".card, .stat-card")
  animatedElements.forEach((el) => observer.observe(el))
}

// Utility functions
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message

  document.body.appendChild(notification)

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.remove()
  }, 5000)
}

function formatDate(date) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
  return new Date(date).toLocaleDateString("ar-EG", options)
}

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

// Export functions for use in other scripts
window.CyberSecApp = {
  togglePassword,
  showNotification,
  formatDate,
  debounce,
}
