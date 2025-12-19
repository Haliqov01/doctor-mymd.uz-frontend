import { BackendResponse } from "@/types";

// Backend API URL - .env.local'dan alınır
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.mymd.uz";
const API_VERSION = "/api/v1";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Backend response handler
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  if (!isJson) {
    if (!response.ok) {
      throw new ApiError(response.status, `HTTP Error: ${response.status}`);
    }
    return {} as T;
  }

  const result: BackendResponse<T> = await response.json();

  if (!result.success || !response.ok) {
    throw new ApiError(
      response.status,
      result.error?.message || "Xatolik yuz berdi",
      result.error?.code,
      result.error?.details
    );
  }

  return result.payload;
}

interface RequestOptions extends RequestInit {
  token?: string;
}

// Token'ı localStorage'dan al
function getStoredToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

// Token'ı localStorage'a kaydet
export function setStoredToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
}

// Token'ı sil
export function clearStoredToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
}

export const apiClient = {
  // GET request
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;
    const authToken = token || getStoredToken();
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(fetchOptions.headers as Record<string, string>),
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_URL}${API_VERSION}${endpoint}`, {
      ...fetchOptions,
      method: "GET",
      headers,
    });

    return handleResponse<T>(response);
  },

  // POST request
  async post<T>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options;
    const authToken = token || getStoredToken();
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(fetchOptions.headers as Record<string, string>),
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_URL}${API_VERSION}${endpoint}`, {
      ...fetchOptions,
      method: "POST",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  },

  // PUT request
  async put<T>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options;
    const authToken = token || getStoredToken();
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(fetchOptions.headers as Record<string, string>),
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_URL}${API_VERSION}${endpoint}`, {
      ...fetchOptions,
      method: "PUT",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  },

  // PATCH request
  async patch<T>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options;
    const authToken = token || getStoredToken();
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(fetchOptions.headers as Record<string, string>),
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_URL}${API_VERSION}${endpoint}`, {
      ...fetchOptions,
      method: "PATCH",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  },

  // DELETE request
  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;
    const authToken = token || getStoredToken();
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(fetchOptions.headers as Record<string, string>),
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_URL}${API_VERSION}${endpoint}`, {
      ...fetchOptions,
      method: "DELETE",
      headers,
    });

    return handleResponse<T>(response);
  },

  // File upload (multipart/form-data)
  async uploadFile<T>(
    endpoint: string,
    formData: FormData,
    options: RequestOptions = {}
  ): Promise<T> {
    const { token, ...fetchOptions } = options;
    const authToken = token || getStoredToken();
    
    const headers: Record<string, string> = {
      "Accept": "application/json",
      ...(fetchOptions.headers as Record<string, string>),
    };
    // Content-Type'ı FormData için otomatik ayarlanması için ekleme

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_URL}${API_VERSION}${endpoint}`, {
      ...fetchOptions,
      method: "POST",
      headers,
      body: formData,
    });

    return handleResponse<T>(response);
  },
};

// API Endpoints - Backend ile uyumlu (Swagger'a göre düzeltilmiş)
export const API_ENDPOINTS = {
  // Auth - SMS tabanlı authentication
  AUTH: {
    CREATE_SESSION: "/Authorization/CreateSession",
    VERIFY_SESSION: "/Authorization/VerifySession",
    REFRESH_TOKEN: "/Authorization/RefreshToken",
    GET_PROFILE: "/Authorization/GetProfile",
    UPDATE_PROFILE: "/Authorization/UpdateProfile",
    UPLOAD_PHOTO: "/Authorization/UploadProfilePhoto",
    DELETE_PHOTO: "/Authorization/DeleteProfilePhoto",
    CHANGE_PASSWORD: "/Authorization/ChangePassword",
    DEACTIVATE: "/Authorization/DeactivateAccount",
    DELETE_ACCOUNT: "/Authorization/DeleteAccount",
  },
  
  // Appointment
  APPOINTMENT: {
    UPSERT: "/Appointment/UpsertAppointment",
    GET_BY_ID: "/Appointment/GetAppointmentById",
    GET_LIST: "/Appointment/GetAppointments",
    UPDATE_STATUS: "/Appointment/UpdateAppointmentStatus",
    CANCEL: "/Appointment/CancelAppointment",
    TOGGLE_ACTIVATION: "/Appointment/ToggleActivation",
    // Reports
    CREATE_REPORT: "/Appointment/CreateReport",
    GET_REPORT: "/Appointment/GetReport",
    GET_REPORTS: "/Appointment/GetReports",
    UPLOAD_REPORT_FILE: "/Appointment/UploadReportFile",
    DOWNLOAD_REPORT: "/Appointment/DownloadReport",
    DELETE_REPORT: "/Appointment/DeleteReport",
  },
  
  // Doctor
  DOCTOR: {
    UPSERT: "/Doctor/UpsertDoctor",
    GET_BY_ID: "/Doctor/GetDoctorById",
    GET_LIST: "/Doctor/GetDoctors",
    TOGGLE_ACTIVATION: "/Doctor/ToggleActivation",
    UPLOAD_CERTIFICATE: "/Doctor/UploadCertificate/upload-certificate",
    GET_CERTIFICATES: "/Doctor/GetCertificates/certificates",
    DOWNLOAD_CERTIFICATE: "/Doctor/DownloadCertificate/download-certificate",
    DELETE_CERTIFICATE: "/Doctor/DeleteCertificate/certificate",
  },
  
  // Patient
  PATIENT: {
    UPSERT: "/Patient/UpsertPatient",
    GET_BY_ID: "/Patient/GetPatientById",
    GET_LIST: "/Patient/GetPatients",
    TOGGLE_ACTIVATION: "/Patient/ToggleActivation",
    UPLOAD_DOCUMENT: "/Patient/UploadDocument/upload-document",
    GET_DOCUMENTS: "/Patient/GetDocuments/documents",
    DOWNLOAD_DOCUMENT: "/Patient/DownloadDocument/download-document",
    DELETE_DOCUMENT: "/Patient/DeleteDocument/document",
  },
  
  // Certificate Type
  CERTIFICATE_TYPE: {
    UPSERT: "/CertificateType/UpsertCertificateType",
    GET_BY_ID: "/CertificateType/GetCertificateType",
    GET_LIST: "/CertificateType/GetCertificateTypes",
    TOGGLE_ACTIVATION: "/CertificateType/ToggleActivation",
  },

  // Document Category
  DOCUMENT_CATEGORY: {
    UPSERT: "/DocumentCategory/UpsertDocumentCategory",
    GET_BY_ID: "/DocumentCategory/GetDocumentCategory",
    GET_LIST: "/DocumentCategory/GetDocumentCategories",
    TOGGLE_ACTIVATION: "/DocumentCategory/ToggleActivation",
  },
};
