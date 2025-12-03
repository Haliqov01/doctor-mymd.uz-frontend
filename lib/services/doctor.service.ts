import { apiClient, API_ENDPOINTS } from "../api-client";
import { Doctor, Certificate, PaginatedResponse, GetDoctorsRequest } from "@/types";

interface DoctorListItem {
  id: number;
  fullName: string;
  specialization: string;
  experienceYears: number;
  status: number;
}

interface DoctorDetail extends Doctor {
  userId: number;
  workplace?: string;
  biography?: string;
  certificates?: {
    path: string;
    originalName: string;
    size: number;
    extension: string;
  }[];
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
  async upsertDoctor(data: {
    id?: number;
    userId?: number;
    fullName: string;
    specialization: string;
    experienceYears: number;
    workplace?: string;
    biography?: string;
  }): Promise<DoctorListItem> {
    return apiClient.post<DoctorListItem>(API_ENDPOINTS.DOCTOR.UPSERT, data);
  },

  // Doktor aktivasyonunu değiştir
  async toggleActivation(doctorId: number): Promise<DoctorListItem> {
    return apiClient.post<DoctorListItem>(
      `${API_ENDPOINTS.DOCTOR.TOGGLE_ACTIVATION}?doctorId=${doctorId}`
    );
  },

  // Sertifika yükle
  async uploadCertificate(data: {
    doctorId: number;
    categoryId: number;
    file: File;
    fileType?: string;
    description?: string;
  }): Promise<Certificate> {
    const formData = new FormData();
    formData.append("DoctorId", data.doctorId.toString());
    formData.append("CategoryId", data.categoryId.toString());
    formData.append("File", data.file);
    if (data.fileType) formData.append("FileType", data.fileType);
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
};

