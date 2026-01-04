import { apiClient, API_ENDPOINTS } from "../api-client";
import { Certificate, PaginatedResponse, GetDoctorsRequest } from "@/types";

interface DoctorListItem {
  id: number;
  fullName: string;
  specialization: string;
  experienceYears: number;
  status: number;
}

interface DoctorDetail {
  id: number;
  userId: number;
  fullName: string;
  specialization: string;
  experienceYears: number;
  workplace?: string;
  biography?: string;
  certificates?: {
    path: string;
    originalName: string;
    size: number;
    extension: string;
  }[];
}

interface UpsertDoctorRequest {
  id?: number;
  userId?: number;
  fullName: string;
  specialization: string;
  experienceYears: number;
  workplace?: string;
  biography?: string;
}

interface UploadCertificateRequest {
  doctorId: number;
  categoryId: number;
  file: File;
  fileType: string;
  description?: string;
}

export const doctorService = {
  // Doktorları listele
  async getDoctors(
    params: GetDoctorsRequest
  ): Promise<PaginatedResponse<DoctorListItem>> {
    return apiClient.post<PaginatedResponse<DoctorListItem>>(
      API_ENDPOINTS.DOCTOR.GET_LIST,
      params
    );
  },

  // Tek doktor getir
  async getDoctorById(doctorId: number): Promise<DoctorDetail> {
    return apiClient.get<DoctorDetail>(
      `${API_ENDPOINTS.DOCTOR.GET_BY_ID}?doctorId=${doctorId}`
    );
  },

  /**
   * Doktor oluştur/güncelle - Swagger Uyumlu
   * Endpoint: POST /api/v1/Doctor/UpsertDoctor
   * @param data UpsertDoctorRequest - userId ZORUNLU
   * @returns DoctorListItem
   */
  async upsertDoctor(data: UpsertDoctorRequest): Promise<DoctorListItem> {
    // Swagger validasyonları
    if (!data.userId) {
      throw new Error("UserId zorunludur");
    }

    if (!data.fullName || data.fullName.trim().length === 0) {
      throw new Error("Tam ad zorunludur (minLength: 1)");
    }

    if (data.fullName.trim().length > 200) {
      throw new Error("Tam ad en fazla 200 karakter olabilir");
    }

    if (!data.specialization || data.specialization.trim().length === 0) {
      throw new Error("İhtisas zorunludur (minLength: 1)");
    }

    if (data.specialization.trim().length > 100) {
      throw new Error("İhtisas en fazla 100 karakter olabilir");
    }

    if (data.experienceYears !== undefined) {
      const exp = Number(data.experienceYears);
      if (isNaN(exp) || exp < 0 || exp > 80) {
        throw new Error("Deneyim yılı 0-80 arasında olmalıdır");
      }
    }

    // Payload hazırlama (swagger formatına uygun)
    const payload: UpsertDoctorRequest = {
      userId: data.userId,
      fullName: data.fullName.trim(),
      specialization: data.specialization.trim(),
      experienceYears: data.experienceYears !== undefined ? Number(data.experienceYears) : 0,
      workplace: data.workplace?.trim() || undefined,
      biography: data.biography?.trim() || undefined,
    };

    // Update için mevcut ID'yi ekle
    if (data.id) {
      payload.id = data.id;
    }

    return apiClient.post<DoctorListItem>(API_ENDPOINTS.DOCTOR.UPSERT, payload);
  },

  // Doktor aktivasyonunu değiştir
  async toggleActivation(doctorId: number): Promise<DoctorListItem> {
    return apiClient.post<DoctorListItem>(
      `${API_ENDPOINTS.DOCTOR.TOGGLE_ACTIVATION}?doctorId=${doctorId}`
    );
  },

  /**
   * Sertifika yükle - Swagger Uyumlu
   * Endpoint: POST /api/v1/Doctor/UploadCertificate/upload-certificate
   * Content-Type: multipart/form-data
   * Required: DoctorId, File, FileType, CategoryId
   */
  async uploadCertificate(data: UploadCertificateRequest): Promise<Certificate> {
    // Swagger validasyonları
    if (!data.doctorId) {
      throw new Error("DoctorId zorunludur");
    }

    if (!data.file) {
      throw new Error("Dosya zorunludur");
    }

    // FileType formatı kontrol et (swagger: maxLength 32)
    let fileType = data.fileType;
    if (!fileType.startsWith('.')) {
      fileType = `.${fileType}`;
    }

    if (fileType.length > 32) {
      throw new Error(`Dosya tipi çok uzun: ${fileType.length} karakter (max: 32)`);
    }

    // Description length check
    if (data.description && data.description.length > 500) {
      throw new Error("Açıklama en fazla 500 karakter olabilir");
    }

    // FormData hazırlama (swagger gereksinimlerine göre)
    const formData = new FormData();
    formData.append("DoctorId", data.doctorId.toString());
    formData.append("CategoryId", data.categoryId.toString());
    formData.append("File", data.file);
    formData.append("FileType", fileType);

    if (data.description) {
      formData.append("Description", data.description.substring(0, 500));
    }

    return apiClient.uploadFile<Certificate>(
      API_ENDPOINTS.DOCTOR.UPLOAD_CERTIFICATE,
      formData
    );
  },

  // Sertifikaları getir
  async getCertificates(doctorId: number): Promise<Certificate[]> {
    return apiClient.get<Certificate[]>(
      `${API_ENDPOINTS.DOCTOR.GET_CERTIFICATES}?doctorId=${doctorId}`
    );
  },

  // Sertifika indir
  async downloadCertificate(certificateId: number): Promise<Blob> {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1${API_ENDPOINTS.DOCTOR.DOWNLOAD_CERTIFICATE}?certificateId=${certificateId}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );

    if (!response.ok) {
      throw new Error("Sertifika indirilemedi");
    }

    return response.blob();
  },

  // Sertifika sil
  async deleteCertificate(certificateId: number): Promise<boolean> {
    return apiClient.delete<boolean>(
      `${API_ENDPOINTS.DOCTOR.DELETE_CERTIFICATE}?certificateId=${certificateId}`
    );
  },
  // Alias methods as requested
  async createDoctorProfile(data: UpsertDoctorRequest): Promise<DoctorListItem> {
    return this.upsertDoctor(data);
  },

  async uploadDoctorCertificate(data: UploadCertificateRequest): Promise<Certificate> {
    return this.uploadCertificate(data);
  },
};
