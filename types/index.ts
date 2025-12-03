// types/index.ts (Hospital-main backend ile uyumlu)

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
  Male = 0,
  Female = 1
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

// Session Types
export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// Backend API Response Types (Hospital-main Result<T> formatı)
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

// Auth Types
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

// Profile Types
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

// Patient Request Types
export interface GetPatientsRequest {
  fullName?: string;
  gender?: string;
  pageNumber: number;
  pageSize: number;
  age?: number;
}
