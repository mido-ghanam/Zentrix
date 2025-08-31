// Password Toggle Function
function togglePassword(fieldId) {
  const field = document.getElementById(fieldId)
  const icon = field.nextElementSibling.querySelector("i")

  if (field.type === "password") {
    field.type = "text"
    icon.classList.remove("fa-eye")
    icon.classList.add("fa-eye-slash")
  } else {
    field.type = "password"
    icon.classList.remove("fa-eye-slash")
    icon.classList.add("fa-eye")
  }
}

// Password Strength Checker
function checkPasswordStrength(password) {
  let strength = 0
  let feedback = ""

  // Length check
  if (password.length >= 8) strength += 25

  // Uppercase check
  if (/[A-Z]/.test(password)) strength += 25

  // Lowercase check
  if (/[a-z]/.test(password)) strength += 25

  // Number and special character check
  if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) strength += 25

  // Determine strength level and color
  if (strength < 25) {
    feedback = "ضعيفة جداً"
    return { strength, feedback, color: "#dc2626", class: "bg-danger" }
  } else if (strength < 50) {
    feedback = "ضعيفة"
    return { strength, feedback, color: "#f59e0b", class: "bg-warning" }
  } else if (strength < 75) {
    feedback = "متوسطة"
    return { strength, feedback, color: "#3b82f6", class: "bg-info" }
  } else {
    feedback = "قوية"
    return { strength, feedback, color: "#10b981", class: "bg-success" }
  }
}

// Dark Mode Toggle
function toggleDarkMode() {
  const body = document.body
  const icon = document.querySelector(".dark-mode-toggle i")

  body.classList.toggle("dark")

  if (body.classList.contains("dark")) {
    icon.classList.remove("fa-moon")
    icon.classList.add("fa-sun")
    localStorage.setItem("darkMode", "enabled")
  } else {
    icon.classList.remove("fa-sun")
    icon.classList.add("fa-moon")
    localStorage.setItem("darkMode", "disabled")
  }
}

// Initialize Dark Mode
function initializeDarkMode() {
  const darkMode = localStorage.getItem("darkMode")
  const icon = document.querySelector(".dark-mode-toggle i")

  if (darkMode === "enabled") {
    document.body.classList.add("dark")
    if (icon) {
      icon.classList.remove("fa-moon")
      icon.classList.add("fa-sun")
    }
  }
}

// Form Validation
function validateForm(formId) {
  const form = document.getElementById(formId)
  const inputs = form.querySelectorAll("input[required]")
  let isValid = true

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.classList.add("is-invalid")
      isValid = false
    } else {
      input.classList.remove("is-invalid")
      input.classList.add("is-valid")
    }
  })

  return isValid
}

// Smooth Animations
function addAnimations() {
  const elements = document.querySelectorAll(".fade-in-up")

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  })

  elements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "all 0.6s ease-out"
    observer.observe(el)
  })
}

// Initialize on DOM Load
document.addEventListener("DOMContentLoaded", () => {
  initializeDarkMode()
  addAnimations()

  // Password strength checker
  const passwordField = document.getElementById("password1")
  if (passwordField) {
    passwordField.addEventListener("input", function () {
      const result = checkPasswordStrength(this.value)
      const strengthBar = document.getElementById("password-strength")
      const strengthText = document.getElementById("password-strength-text")

      if (strengthBar && strengthText) {
        strengthBar.style.width = result.strength + "%"
        strengthBar.className = `progress-bar ${result.class}`
        strengthText.textContent = result.feedback
        strengthText.style.color = result.color
      }
    })
  }

  // Form validation on submit
  const forms = document.querySelectorAll("form")
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      const requiredInputs = form.querySelectorAll("input[required]")
      let isValid = true

      requiredInputs.forEach((input) => {
        if (!input.value.trim()) {
          input.classList.add("is-invalid")
          isValid = false
        } else {
          input.classList.remove("is-invalid")
        }
      })

      if (!isValid) {
        e.preventDefault()
        // Show error message
        const errorAlert = document.createElement("div")
        errorAlert.className = "alert alert-danger mt-3"
        errorAlert.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i>يرجى ملء جميع الحقول المطلوبة'

        const existingAlert = form.querySelector(".alert-danger")
        if (existingAlert) {
          existingAlert.remove()
        }

        form.appendChild(errorAlert)

        setTimeout(() => {
          errorAlert.remove()
        }, 5000)
      }
    })
  })
})

// Loading State
function showLoading(button) {
  const originalText = button.innerHTML
  button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>جاري التحميل...'
  button.disabled = true

  setTimeout(() => {
    button.innerHTML = originalText
    button.disabled = false
  }, 2000)
}

// Add loading to submit buttons
document.addEventListener("DOMContentLoaded", () => {
  const submitButtons = document.querySelectorAll('button[type="submit"]')
  submitButtons.forEach((button) => {
    button.addEventListener("click", function () {
      showLoading(this)
    })
  })
})
