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

  // Doktor oluştur/güncelle
  async upsertDoctor(data: UpsertDoctorRequest): Promise<DoctorListItem> {
    return apiClient.post<DoctorListItem>(API_ENDPOINTS.DOCTOR.UPSERT, data);
  },

  // Doktor aktivasyonunu değiştir
  async toggleActivation(doctorId: number): Promise<DoctorListItem> {
    return apiClient.post<DoctorListItem>(
      `${API_ENDPOINTS.DOCTOR.TOGGLE_ACTIVATION}?doctorId=${doctorId}`
    );
  },

  // Sertifika yükle
  async uploadCertificate(data: UploadCertificateRequest): Promise<Certificate> {
    const formData = new FormData();
    formData.append("DoctorId", data.doctorId.toString());
    formData.append("CategoryId", data.categoryId.toString());
    formData.append("File", data.file);
    formData.append("FileType", data.fileType);
    if (data.description) formData.append("Description", data.description);

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
};
