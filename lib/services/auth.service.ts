import { apiClient, API_ENDPOINTS, setStoredToken, clearStoredToken } from "../api-client";
import { SignInRequest, SignInResponse, SignUpRequest, ProfileResponse } from "@/types";

export const authService = {
  // Giriş yap
  async signIn(data: SignInRequest): Promise<SignInResponse> {
    const response = await apiClient.post<SignInResponse>(
      API_ENDPOINTS.AUTH.SIGN_IN,
      data
    );
    
    // Token'ı kaydet
    if (response.token) {
      setStoredToken(response.token);
    }
    
    return response;
  },

  // Kayıt ol
  async signUp(data: SignUpRequest): Promise<any> {
    return apiClient.post(API_ENDPOINTS.AUTH.SIGN_UP, data);
  },

  // Profil bilgilerini al
  async getProfile(): Promise<ProfileResponse> {
    return apiClient.get<ProfileResponse>(API_ENDPOINTS.AUTH.GET_PROFILE);
  },

  // Profil güncelle
  async updateProfile(data: Partial<ProfileResponse>): Promise<ProfileResponse> {
    return apiClient.put<ProfileResponse>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data);
  },

  // Profil fotoğrafı yükle
  async uploadProfilePhoto(file: File): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.uploadFile(API_ENDPOINTS.AUTH.UPLOAD_PHOTO, formData);
  },

  // Profil fotoğrafını sil
  async deleteProfilePhoto(): Promise<any> {
    return apiClient.delete(API_ENDPOINTS.AUTH.DELETE_PHOTO);
  },

  // Şifre değiştir
  async changePassword(oldPassword: string, newPassword: string): Promise<any> {
    return apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      oldPassword,
      newPassword,
    });
  },

  // Çıkış yap
  logout(): void {
    clearStoredToken();
  },

  // Hesabı devre dışı bırak
  async deactivateAccount(): Promise<any> {
    return apiClient.post(API_ENDPOINTS.AUTH.DEACTIVATE);
  },

  // Hesabı sil
  async deleteAccount(): Promise<any> {
    return apiClient.delete(API_ENDPOINTS.AUTH.DELETE_ACCOUNT);
  },
};

