// Language switching functionality
let currentLanguage = "ar"

document.addEventListener("DOMContentLoaded", () => {
  initializeLanguageSystem()
})

function initializeLanguageSystem() {
  // Get saved language preference
  const savedLanguage = localStorage.getItem("language") || "ar"
  currentLanguage = savedLanguage

  // Set initial language
  setLanguage(currentLanguage)

  // Add language toggle event listener
  const langToggle = document.getElementById("langToggle")
  if (langToggle) {
    langToggle.addEventListener("click", toggleLanguage)
  }
}

function toggleLanguage() {
  const newLanguage = currentLanguage === "ar" ? "en" : "ar"
  setLanguage(newLanguage)
}

function setLanguage(language) {
  currentLanguage = language

  // Save preference
  localStorage.setItem("language", language)

  // Update HTML attributes
  const htmlRoot = document.getElementById("html-root")
  if (language === "ar") {
    htmlRoot.setAttribute("lang", "ar")
    htmlRoot.setAttribute("dir", "rtl")
    document.body.style.fontFamily = "'Cairo', sans-serif"
  } else {
    htmlRoot.setAttribute("lang", "en")
    htmlRoot.setAttribute("dir", "ltr")
    document.body.style.fontFamily = "'Inter', sans-serif"
  }

  // Update language toggle button
  const langText = document.getElementById("langText")
  if (langText) {
    langText.textContent = language === "ar" ? "EN" : "ع"
  }

  // Update all translatable elements
  updateTranslatableElements()

  // Update form placeholders
  updateFormPlaceholders()

  // Trigger custom event for other components
  document.dispatchEvent(
    new CustomEvent("languageChanged", {
      detail: { language: language },
    }),
  )
}

function updateTranslatableElements() {
  const elements = document.querySelectorAll("[data-ar][data-en]")

  elements.forEach((element) => {
    const text = element.getAttribute(`data-${currentLanguage}`)
    if (text) {
      // Handle different element types
      if (element.tagName === "INPUT" && element.type === "submit") {
        element.value = text
      } else if (element.tagName === "INPUT" && element.hasAttribute("placeholder")) {
        element.placeholder = text
      } else {
        element.textContent = text
      }
    }
  })
}

function updateFormPlaceholders() {
  const inputs = document.querySelectorAll("input[data-ar-placeholder][data-en-placeholder]")

  inputs.forEach((input) => {
    const placeholder = input.getAttribute(`data-${currentLanguage}-placeholder`)
    if (placeholder) {
      input.placeholder = placeholder
    }
  })
}

// Translation object for dynamic content
const translations = {
  ar: {
    // Common
    loading: "جاري التحميل...",
    error: "حدث خطأ",
    success: "تم بنجاح",
    confirm: "تأكيد",
    cancel: "إلغاء",
    save: "حفظ",
    delete: "حذف",
    edit: "تعديل",
    add: "إضافة",
    search: "بحث",
    filter: "تصفية",
    export: "تصدير",
    import: "استيراد",
    refresh: "تحديث",
    close: "إغلاق",

    // Dashboard
    dashboard: "لوحة التحكم",
    overview: "نظرة عامة",
    statistics: "إحصائيات",
    recent_activity: "النشاط الأخير",
    system_status: "حالة النظام",

    // Security
    security_score: "نقاط الأمان",
    threat_level: "مستوى التهديد",
    blocked_attacks: "الهجمات المحجوبة",
    active_threats: "التهديدات النشطة",
    security_alerts: "تنبيهات الأمان",

    // Time
    minutes_ago: "منذ {0} دقيقة",
    hours_ago: "منذ {0} ساعة",
    days_ago: "منذ {0} يوم",
    just_now: "الآن",

    // Status
    active: "نشط",
    inactive: "غير نشط",
    pending: "في الانتظار",
    completed: "مكتمل",
    failed: "فشل",

    // Threat levels
    high: "عالي",
    medium: "متوسط",
    low: "منخفض",
    critical: "حرج",
  },

  en: {
    // Common
    loading: "Loading...",
    error: "Error occurred",
    success: "Success",
    confirm: "Confirm",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    search: "Search",
    filter: "Filter",
    export: "Export",
    import: "Import",
    refresh: "Refresh",
    close: "Close",

    // Dashboard
    dashboard: "Dashboard",
    overview: "Overview",
    statistics: "Statistics",
    recent_activity: "Recent Activity",
    system_status: "System Status",

    // Security
    security_score: "Security Score",
    threat_level: "Threat Level",
    blocked_attacks: "Blocked Attacks",
    active_threats: "Active Threats",
    security_alerts: "Security Alerts",

    // Time
    minutes_ago: "{0} minutes ago",
    hours_ago: "{0} hours ago",
    days_ago: "{0} days ago",
    just_now: "Just now",

    // Status
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    completed: "Completed",
    failed: "Failed",

    // Threat levels
    high: "High",
    medium: "Medium",
    low: "Low",
    critical: "Critical",
  },
}

// Translation helper function
function t(key, ...args) {
  let translation = translations[currentLanguage][key] || key

  // Replace placeholders {0}, {1}, etc.
  args.forEach((arg, index) => {
    translation = translation.replace(`{${index}}`, arg)
  })

  return translation
}

// Format numbers based on language
function formatNumber(number) {
  if (currentLanguage === "ar") {
    return number.toLocaleString("ar-EG")
  } else {
    return number.toLocaleString("en-US")
  }
}

// Format dates based on language
function formatDate(date) {
  const dateObj = new Date(date)

  if (currentLanguage === "ar") {
    return dateObj.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } else {
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }
}

// Export functions
window.LanguageSystem = {
  setLanguage,
  toggleLanguage,
  getCurrentLanguage: () => currentLanguage,
  t,
  formatNumber,
  formatDate,
}
