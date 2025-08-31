const translations = {
  ar: {
    // Authentication
    login: "تسجيل الدخول",
    register: "إنشاء حساب جديد",
    reset_password: "استعادة كلمة المرور",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirm_password: "تأكيد كلمة المرور",
    first_name: "الاسم الأول",
    last_name: "اسم العائلة",
    username: "اسم المستخدم",
    remember_me: "تذكرني",
    forgot_password: "نسيت كلمة المرور؟",
    create_account: "إنشاء الحساب",
    sign_in: "تسجيل الدخول",
    send_reset_link: "إرسال رابط الاستعادة",
    back_to_login: "العودة إلى تسجيل الدخول",

    // Messages
    security_notice: "يتم تشفير جميع البيانات وحمايتها بأعلى معايير الأمان",
    advanced_security: "أمان متقدم:",
    global_security_standards: "يتم تشفير جميع البيانات وحمايتها بأعلى معايير الأمان العالمية",
    instructions: "تعليمات:",
    check_email_spam: "تحقق من صندوق البريد الوارد والرسائل المزعجة للحصول على رابط الاستعادة",
    have_account: "لديك حساب بالفعل؟",
    no_account: "ليس لديك حساب؟",
    agree_terms: "أوافق على",
    terms_conditions: "الشروط والأحكام",
    privacy_policy: "سياسة الخصوصية",

    // Password Strength
    password_strength: "قوة كلمة المرور",
    very_weak: "ضعيفة جداً",
    weak: "ضعيفة",
    medium: "متوسطة",
    strong: "قوية",

    // System
    cybersecurity_system: "نظام الأمن السيبراني",
    advanced_cybersecurity: "نظام الأمن السيبراني المتطور",
    join_system: "انضم إلى نظام الأمن السيبراني المتطور",
    access_account: "ادخل إلى حسابك للوصول إلى نظام الأمن السيبراني",
    enter_email_reset: "أدخل بريدك الإلكتروني لإرسال رابط الاستعادة",

    // Form Validation
    fill_required_fields: "يرجى ملء جميع الحقول المطلوبة",
    loading: "جاري التحميل...",
    enter_email: "أدخل بريدك الإلكتروني",
  },

  en: {
    // Authentication
    login: "Login",
    register: "Create New Account",
    reset_password: "Reset Password",
    email: "Email Address",
    password: "Password",
    confirm_password: "Confirm Password",
    first_name: "First Name",
    last_name: "Last Name",
    username: "Username",
    remember_me: "Remember Me",
    forgot_password: "Forgot Password?",
    create_account: "Create Account",
    sign_in: "Sign In",
    send_reset_link: "Send Reset Link",
    back_to_login: "Back to Login",

    // Messages
    security_notice: "All data is encrypted and protected with the highest security standards",
    advanced_security: "Advanced Security:",
    global_security_standards: "All data is encrypted and protected with the highest global security standards",
    instructions: "Instructions:",
    check_email_spam: "Check your inbox and spam folder for the reset link",
    have_account: "Already have an account?",
    no_account: "Don't have an account?",
    agree_terms: "I agree to the",
    terms_conditions: "Terms and Conditions",
    privacy_policy: "Privacy Policy",

    // Password Strength
    password_strength: "Password Strength",
    very_weak: "Very Weak",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",

    // System
    cybersecurity_system: "Cybersecurity System",
    advanced_cybersecurity: "Advanced Cybersecurity System",
    join_system: "Join the Advanced Cybersecurity System",
    access_account: "Access your account to enter the cybersecurity system",
    enter_email_reset: "Enter your email address to send reset link",

    // Form Validation
    fill_required_fields: "Please fill in all required fields",
    loading: "Loading...",
    enter_email: "Enter your email address",
  },
}

let currentLanguage = "ar"

function setLanguage(lang) {
  currentLanguage = lang
  localStorage.setItem("language", lang)

  // Update HTML attributes
  document.documentElement.lang = lang
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"

  // Update language toggle buttons
  const buttons = document.querySelectorAll(".language-toggle button")
  buttons.forEach((btn) => {
    btn.classList.remove("active")
    if ((lang === "ar" && btn.textContent.includes("عربي")) || (lang === "en" && btn.textContent.includes("English"))) {
      btn.classList.add("active")
    }
  })

  // Translate page content
  translatePage()

  // Update Bootstrap RTL/LTR
  updateBootstrapDirection(lang)
}

function translatePage() {
  const elements = document.querySelectorAll("[data-translate]")

  elements.forEach((element) => {
    const key = element.getAttribute("data-translate")
    if (translations[currentLanguage] && translations[currentLanguage][key]) {
      if (element.tagName === "INPUT" && element.type !== "submit") {
        element.placeholder = translations[currentLanguage][key]
      } else {
        element.textContent = translations[currentLanguage][key]
      }
    }
  })
}

function updateBootstrapDirection(lang) {
  const isRTL = lang === "ar"

  // Update Bootstrap classes for RTL/LTR
  const elementsToUpdate = document.querySelectorAll(".me-2, .ms-2, .pe-2, .ps-2")
  elementsToUpdate.forEach((element) => {
    if (isRTL) {
      element.classList.replace("me-2", "ms-2")
      element.classList.replace("pe-2", "ps-2")
    } else {
      element.classList.replace("ms-2", "me-2")
      element.classList.replace("ps-2", "pe-2")
    }
  })
}

function initializeLanguage() {
  const savedLanguage = localStorage.getItem("language") || "ar"
  setLanguage(savedLanguage)
}

// Auto-translate elements with data-translate attribute
function autoTranslate() {
  // Add data-translate attributes to common elements
  const titleElements = document.querySelectorAll("title")
  titleElements.forEach((el) => {
    if (el.textContent.includes("تسجيل الدخول")) {
      el.setAttribute("data-translate", "login")
    } else if (el.textContent.includes("إنشاء حساب")) {
      el.setAttribute("data-translate", "register")
    } else if (el.textContent.includes("استعادة كلمة المرور")) {
      el.setAttribute("data-translate", "reset_password")
    }
  })

  // Add more auto-translation logic as needed
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  initializeLanguage()
  autoTranslate()
})

// Export functions for global use
window.setLanguage = setLanguage
window.translatePage = translatePage
