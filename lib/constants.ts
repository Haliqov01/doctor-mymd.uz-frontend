// Application Constants

// API Response Messages
export const API_MESSAGES = {
  SUCCESS: "İşlem başarılı",
  ERROR: "Bir hata oluştu",
  UNAUTHORIZED: "Yetkilendirme gerekli",
  FORBIDDEN: "Bu işlem için yetkiniz yok",
  NOT_FOUND: "Kayıt bulunamadı",
  VALIDATION_ERROR: "Giriş verisi geçersiz",
  RATE_LIMIT: "Çok fazla istek. Lütfen daha sonra tekrar deneyin",
} as const;

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  ALLOWED_EXTENSIONS: [".pdf", ".jpg", ".jpeg", ".png", ".webp", ".doc", ".docx"],
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// User Roles
export const USER_ROLES = {
  DOCTOR: "DOCTOR",
} as const;

// User Status
export const USER_STATUS = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
  INACTIVE: "INACTIVE",
} as const;

// Routes - DOCTOR APP ONLY
export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
  },
  DASHBOARD: {
    HOME: "/dashboard",
    APPOINTMENTS: "/dashboard/appointments",
    PROFILE: "/dashboard/profile",
    PROFILE_COMPLETE: "/dashboard/profile/complete",
    WORKING_HOURS: "/dashboard/working-hours",
  },
} as const;

