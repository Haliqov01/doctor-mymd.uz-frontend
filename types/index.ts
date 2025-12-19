// types/index.ts (Swagger API ile uyumlu)

export enum UserRole {
  User = "User",
  Admin = "Admin",
  Doctor = "Doctor"
}

export enum EntityStatus {
  Active = 0,
  Inactive = 1,
  Deleted = 2
}

export enum Gender {
  Male = 1,
  Female = 2
}

export enum AppointmentStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
  Completed = 3
}

export interface User {
  id: number;
  firstName: string;
  lastName?: string;
  email?: string;
  password: string;
  phone: string;
  dateOfBirth?: Date;
  gender?: Gender;
  address?: string;
  profilePhotoPath?: string;
  role: UserRole;
  createdDate: Date;
  updatedDate: Date;
  status: EntityStatus;
}

export interface Patient {
  id: number;
  userId: number;
  user?: User;
  fullName: string;
  age: number;
  gender: string;
  address?: string;
  additionalNotes?: string;
  createdDate: Date;
  updatedDate: Date;
  status: EntityStatus;
}

export interface Doctor {
  id: number;
  userId: number;
  user?: User;
  fullName: string;
  specialization: string;
  experienceYears: number;
  workplace?: string;
  biography?: string;
  certificates?: Certificate[];
  createdDate: Date;
  updatedDate: Date;
  status: EntityStatus;
}

export interface Certificate {
  id: number;
  fileName: string;
  fileType: string;
  categoryName: string;
  uploadedAt: string;
  fileSize: number;
  downloadUrl: string;
}

export interface Document {
  id: number;
  fileName: string;
  fileType: string;
  categoryName?: string;
  uploadedAt: string;
  fileSize: number;
  downloadUrl?: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  patientPhone: string;
  doctorId: number;
  doctorName: string;
  doctorSpecialization: string;
  message?: string;
  scheduledDate: string;
  duration: number;
  status: AppointmentStatus;
  statusName: string;
  createdDate: string;
  updatedDate: string;
  isDeleted: number;
}

// Backend API Response Types (Result<T> formatı)
export interface BackendResponse<T = any> {
  payload: T;
  success: boolean;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// Paginated Response
export interface PaginatedResponse<T> {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  isFirst: boolean;
  isLast: boolean;
  data: T[];
}

// Auth Types - SMS Tabanlı
export interface CreateSessionRequest {
  phone: string;
}

export interface CreateSessionResponse {
  sessionId: number;
  expireDate: string;
}

export interface VerifySessionRequest {
  sessionId: number;
  code: string;
}

export interface VerifySessionResponse {
  accessToken: string;
  accessTokenExpiry: string;
  refreshToken: string;
  refreshTokenExpiry: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  accessTokenExpiry: string;
  refreshToken: string;
  refreshTokenExpiry: string;
}

// Profile Types
export interface UserProfileViewModel {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  dateOfBirth?: string;
  gender?: Gender;
  address?: string;
  profilePhotoUrl?: string;
  status: EntityStatus;
  createdDate: string;
  updatedDate?: string;
}

export interface UpdateProfileRequest {
  userId: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: Gender;
  address?: string;
}

export interface ChangePasswordRequest {
  userId: number;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Working Hours (Frontend only - Backend'de henüz yok)
export interface WorkingHour {
  id?: number;
  doctorId?: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  breakStart: string | null;
  breakEnd: string | null;
  isActive: boolean;
}

// Appointment Request Types
export interface GetAppointmentsRequest {
  pageNumber: number;
  pageSize: number;
  patientId?: number;
  doctorId?: number;
  status?: AppointmentStatus;
  fromDate?: string;
  toDate?: string;
}

export interface CreateAppointmentRequest {
  patientId: number;
  doctorId: number;
  message?: string;
  scheduledDate?: string;
  duration?: number;
}

export interface UpdateAppointmentStatusRequest {
  appointmentId: number;
  status: AppointmentStatus;
  notes?: string;
  scheduledDate?: string;
  duration?: number;
}

// Doctor Request Types
export interface GetDoctorsRequest {
  fullName?: string;
  specialization?: string;
  pageNumber: number;
  pageSize: number;
  experienceYears?: number;
}

export interface UpsertDoctorRequest {
  id?: number;
  userId?: number;
  fullName: string;
  specialization: string;
  experienceYears: number;
  workplace?: string;
  biography?: string;
}

// Patient Request Types
export interface GetPatientsRequest {
  fullName?: string;
  gender?: string;
  pageNumber: number;
  pageSize: number;
  age?: number;
}

export interface UpsertPatientRequest {
  id?: number;
  userId?: number;
  fullName: string;
  gender: string;
  age: number;
  address?: string;
  additionalNotes?: string;
}

// Report Types
export interface Report {
  id: number;
  patientId: number;
  patientName?: string;
  patientPhone?: string;
  doctorId: number;
  doctorName?: string;
  doctorSpecialization?: string;
  reportText: string;
  appointmentId?: number;
  pdfPath?: string;
  downloadUrl?: string;
  notes?: string;
  reportDate: string;
  createdDate: string;
}

export interface CreateReportRequest {
  patientId: number;
  doctorId: number;
  reportText: string;
  appointmentId?: number;
  reportFile?: File;
  notes?: string;
}

export interface GetReportsRequest {
  patientId?: number;
  doctorId?: number;
  fromDate?: string;
  toDate?: string;
  searchText?: string;
  pageNumber?: number;
  pageSize?: number;
  all?: boolean;
}

// Certificate Type
export interface CertificateType {
  id: number;
  keyWord?: string;
  valueRu?: string;
  valueUz?: string;
  valueUzl?: string;
  valueEn?: string;
  status: EntityStatus;
}

export interface UpsertCertificateTypeRequest {
  id?: number;
  keyWord?: string;
  valueRu?: string;
  valueUz?: string;
  valueUzl?: string;
  valueEn?: string;
  status?: EntityStatus;
}

// Document Category
export interface DocumentCategory {
  id: number;
  keyWord?: string;
  valueRu?: string;
  valueUz?: string;
  valueUzl?: string;
  valueEn?: string;
  status: EntityStatus;
}

export interface UpsertDocumentCategoryRequest {
  id?: number;
  keyWord?: string;
  valueRu?: string;
  valueUz?: string;
  valueUzl?: string;
  valueEn?: string;
}

// File ViewModel (Backend'den dönen dosya bilgisi)
export interface FileViewModel {
  path: string;
  originalName: string;
  size: number;
  extension: string;
}

// Upload Certificate Request
export interface UploadCertificateRequest {
  doctorId: number;
  file: File;
  fileType: string;
  categoryId: number;
  description?: string;
}

// Upload Document Request
export interface UploadDocumentRequest {
  patientId: number;
  file: File;
  fileType: string;
  categoryId?: number;
}

// Legacy types - geriye uyumluluk için
export interface SignInRequest {
  phone: string;
  password: string;
}

export interface SignInResponse {
  token: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
  };
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  email?: string;
}

export interface ProfileResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: number;
  address?: string;
  profilePhotoPath?: string;
  role: string;
}

// Session Payload (JWT decode için)
export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
