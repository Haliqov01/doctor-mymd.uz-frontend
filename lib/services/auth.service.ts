import { apiClient, API_ENDPOINTS, setStoredToken, clearStoredToken } from "../api-client";

// Session Types (SMS tabanlı authentication)
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

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  dateOfBirth?: string;
  gender?: number;
  address?: string;
  profilePhotoUrl?: string;
  status: number;
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
  gender?: number;
  address?: string;
}

export interface ChangePasswordRequest {
  userId: number;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const authService = {
  // SMS oturumu başlat - telefon numarasına kod gönderir
  async createSession(phone: string): Promise<CreateSessionResponse> {
    return apiClient.post<CreateSessionResponse>(
      API_ENDPOINTS.AUTH.CREATE_SESSION,
      { phone }
    );
  },

  // SMS kodunu doğrula ve giriş yap
  async verifySession(data: VerifySessionRequest): Promise<VerifySessionResponse> {
    const response = await apiClient.post<VerifySessionResponse>(
      API_ENDPOINTS.AUTH.VERIFY_SESSION,
      data
    );
    
    // Token'ları kaydet
    if (response.accessToken) {
      setStoredToken(response.accessToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("refresh_token", response.refreshToken);
        localStorage.setItem("access_token_expiry", response.accessTokenExpiry);
        localStorage.setItem("refresh_token_expiry", response.refreshTokenExpiry);
      }
    }
    
    return response;
  },

  // Token yenile
  async refreshToken(refreshToken?: string): Promise<RefreshTokenResponse> {
    const token = refreshToken || (typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null);
    
    if (!token) {
      throw new Error("Refresh token bulunamadı");
    }

    const response = await apiClient.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      { refreshToken: token }
    );
    
    if (response.accessToken) {
      setStoredToken(response.accessToken);
      if (typeof window !== "undefined") {
        localStorage.setItem("refresh_token", response.refreshToken);
        localStorage.setItem("access_token_expiry", response.accessTokenExpiry);
        localStorage.setItem("refresh_token_expiry", response.refreshTokenExpiry);
      }
    }
    
    return response;
  },

  // Profil bilgilerini al
  async getProfile(): Promise<UserProfile> {
    return apiClient.get<UserProfile>(API_ENDPOINTS.AUTH.GET_PROFILE);
  },

  // Profil güncelle
  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    return apiClient.put<UserProfile>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data);
  },

  // Profil fotoğrafı yükle
  async uploadProfilePhoto(userId: number, photo: File): Promise<UserProfile> {
    const formData = new FormData();
    formData.append("UserId", userId.toString());
    formData.append("Photo", photo);
    return apiClient.uploadFile<UserProfile>(API_ENDPOINTS.AUTH.UPLOAD_PHOTO, formData);
  },

  // Profil fotoğrafını sil
  async deleteProfilePhoto(): Promise<boolean> {
    return apiClient.delete<boolean>(API_ENDPOINTS.AUTH.DELETE_PHOTO);
  },

  // Şifre değiştir
  async changePassword(data: ChangePasswordRequest): Promise<boolean> {
    return apiClient.post<boolean>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  },

  // Çıkış yap
  logout(): void {
    clearStoredToken();
    if (typeof window !== "undefined") {
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("access_token_expiry");
      localStorage.removeItem("refresh_token_expiry");
    }
  },

  // Hesabı devre dışı bırak
  async deactivateAccount(): Promise<boolean> {
    return apiClient.post<boolean>(API_ENDPOINTS.AUTH.DEACTIVATE);
  },

  // Hesabı sil
  async deleteAccount(): Promise<boolean> {
    return apiClient.delete<boolean>(API_ENDPOINTS.AUTH.DELETE_ACCOUNT);
  },

  // Token geçerli mi kontrol et
  isTokenExpired(): boolean {
    if (typeof window === "undefined") return true;
    
    const expiry = localStorage.getItem("access_token_expiry");
    if (!expiry) return true;
    
    return new Date(expiry) <= new Date();
  },

  // Refresh token geçerli mi kontrol et
  isRefreshTokenExpired(): boolean {
    if (typeof window === "undefined") return true;
    
    const expiry = localStorage.getItem("refresh_token_expiry");
    if (!expiry) return true;
    
    return new Date(expiry) <= new Date();
  },

  // Oturum açık mı kontrol et
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    
    const token = localStorage.getItem("auth_token");
    return !!token && !this.isTokenExpired();
  },
};
