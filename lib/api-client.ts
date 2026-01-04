import { BackendResponse } from "@/types";
import { isTokenExpired } from "./utils/token";
import { apiLogger } from "@/lib/utils/logger";

// Backend API URL - .env.local'dan alınır veya boş bırakılır (proxy için)
const API_URL = "";
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

// Flag to prevent infinite refresh loops
let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

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

  // DEBUG: Log the backend response
  apiLogger.debug("Response", {
    url: response.url,
    status: response.status,
    success: result.success,
  });

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
    apiLogger.debug("Auth", `Setting token: ${token ? token.substring(0, 5) + "..." : "null"}`);
    localStorage.setItem("auth_token", token);
  }
}

// Token'ı sil
export function clearStoredToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
    document.cookie = "token=; path=/; max-age=0"; // Clear cookie too
  }
}

// Attempt to refresh token - returns true if refresh succeeded
async function attemptTokenRefresh(): Promise<boolean> {
  if (isRefreshing) {
    // Wait for ongoing refresh
    if (refreshPromise) {
      await refreshPromise;
      return !!getStoredToken();
    }
    return false;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const storedRefreshToken = typeof window !== "undefined"
        ? localStorage.getItem("refresh_token")
        : null;

      if (!storedRefreshToken) {
        apiLogger.warn("Refresh", "No refresh token available");
        return;
      }

      apiLogger.info("Refresh", "Attempting token refresh...");

      // Call refresh endpoint directly to avoid circular dependency
      const response = await fetch(`${API_URL}${API_VERSION}/Authorization/RefreshToken`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (!response.ok) {
        throw new Error("Refresh failed");
      }

      const result: BackendResponse<any> = await response.json();

      if (result.success && result.payload?.accessToken) {
        apiLogger.info("Refresh", "Token refresh successful");
        setStoredToken(result.payload.accessToken);

        if (typeof window !== "undefined") {
          localStorage.setItem("refresh_token", result.payload.refreshToken);
          localStorage.setItem("access_token_expiry", result.payload.accessTokenExpiry);
          localStorage.setItem("refresh_token_expiry", result.payload.refreshTokenExpiry);
        }
      } else {
        throw new Error("Invalid refresh response");
      }
    } catch (error) {
      apiLogger.error("Refresh", "Token refresh failed:", error);
      clearStoredToken();

      // Redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  await refreshPromise;
  return !!getStoredToken();
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

    const url = `${API_URL}${API_VERSION}${endpoint}`;

    apiLogger.debug("GET", endpoint, authToken ? "(authenticated)" : "(no token)");

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        method: "GET",
        headers,
      });

      return handleResponse<T>(response);
    } catch (error) {
      // If 401 and we're not already refreshing, try token refresh
      if (error instanceof ApiError && error.status === 401 && !isRefreshing) {
        apiLogger.info("Auth", `401 on GET ${endpoint}, refreshing token...`);
        const refreshed = await attemptTokenRefresh();

        if (refreshed) {
          apiLogger.debug("Auth", `Retrying GET ${endpoint} with new token`);
          // Retry with new token
          const newToken = getStoredToken();
          if (newToken) {
            headers["Authorization"] = `Bearer ${newToken}`;
          }

          const retryResponse = await fetch(url, {
            ...fetchOptions,
            method: "GET",
            headers,
          });

          return handleResponse<T>(retryResponse);
        }
      }

      apiLogger.error("GET", `Error on ${endpoint}:`, error);
      throw error;
    }
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

    const url = `${API_URL}${API_VERSION}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        method: "POST",
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      return handleResponse<T>(response);
    } catch (error) {
      apiLogger.error("POST", `Error on ${endpoint}:`, error);
      throw error;
    }
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

    const url = `${API_URL}${API_VERSION}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        method: "PUT",
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      return handleResponse<T>(response);
    } catch (error) {
      apiLogger.error("PUT", `Error on ${endpoint}:`, error);
      throw error;
    }
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

    const url = `${API_URL}${API_VERSION}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        method: "PATCH",
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      return handleResponse<T>(response);
    } catch (error) {
      apiLogger.error("PATCH", `Error on ${endpoint}:`, error);
      throw error;
    }
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

    const url = `${API_URL}${API_VERSION}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        method: "DELETE",
        headers,
      });

      return handleResponse<T>(response);
    } catch (error) {
      apiLogger.error("DELETE", `Error on ${endpoint}:`, error);
      throw error;
    }
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

    const url = `${API_URL}${API_VERSION}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        method: "POST",
        headers,
        body: formData,
      });

      return handleResponse<T>(response);
    } catch (error) {
      apiLogger.error("UPLOAD", `Error on ${endpoint}:`, error);
      throw error;
    }
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
