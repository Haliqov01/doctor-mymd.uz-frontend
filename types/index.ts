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
  createdDate: Date;
  updatedDate: Date;
  status: EntityStatus;
}

export interface Appointment {
  id: number;
  patientId: number;
  patient?: Patient;
  doctorId: number;
  doctor?: Doctor;
  message?: string;
  scheduledDate: Date;
  duration: number;
  appointmentStatus: AppointmentStatus;
  createdDate: Date;
  updatedDate: Date;
  status: EntityStatus;
}

// Session Types
export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// API Response Types (Hospital-main Result<T> için)
export interface ApiResponse<T = any> {
  isSuccess: boolean;
  data?: T;
  errorModel?: {
    errorType: string;
    errorMessage: string;
  };
}

