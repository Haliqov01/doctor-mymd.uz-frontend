export { authService } from "./auth.service";
export { appointmentService } from "./appointment.service";
export { doctorService } from "./doctor.service";
export { patientService } from "./patient.service";
export { reportService } from "./report.service";
export { documentCategoryService } from "./document-category.service";
export { certificateTypeService } from "./certificate-type.service";

// Re-export types from services
export type {
  CreateSessionRequest,
  CreateSessionResponse,
  VerifySessionRequest,
  VerifySessionResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "./auth.service";

export type {
  DocumentCategory,
  UpsertDocumentCategoryRequest,
  GetDocumentCategoriesRequest,
} from "./document-category.service";

export type {
  GetCertificateTypesRequest,
} from "./certificate-type.service";
