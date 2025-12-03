import { apiClient, API_ENDPOINTS } from "../api-client";
import { Patient, PaginatedResponse, GetPatientsRequest } from "@/types";

interface PatientListItem {
  id: number;
  userId: number;
  fullName: string;
  gender: string;
  age: number;
}

interface PatientDetail extends Patient {
  documents?: {
    path: string;
    originalName: string;
    size: number;
    extension: string;
  }[];
}

export const patientService = {
  // Hastaları listele
  async getPatients(
    params: GetPatientsRequest
  ): Promise<PaginatedResponse<PatientListItem>> {
    return apiClient.post<PaginatedResponse<PatientListItem>>(
      API_ENDPOINTS.PATIENT.GET_LIST,
      params
    );
  },

  // Tek hasta getir
  async getPatientById(patientId: number): Promise<PatientDetail> {
    return apiClient.get<PatientDetail>(
      `${API_ENDPOINTS.PATIENT.GET_BY_ID}?patientId=${patientId}`
    );
  },

  // Hasta oluştur/güncelle
  async upsertPatient(data: {
    id?: number;
    userId?: number;
    fullName: string;
    gender: string;
    age: number;
    address?: string;
    additionalNotes?: string;
  }): Promise<PatientListItem> {
    return apiClient.post<PatientListItem>(API_ENDPOINTS.PATIENT.UPSERT, data);
  },

  // Hasta aktivasyonunu değiştir
  async toggleActivation(patientId: number): Promise<PatientListItem> {
    return apiClient.post<PatientListItem>(
      `${API_ENDPOINTS.PATIENT.TOGGLE_ACTIVATION}?patientId=${patientId}`
    );
  },

  // Doktora göre hastaları getir (randevusu olan hastalar)
  // NOT: Bu endpoint backend'de henüz yok, eklenmesi gerekiyor
  async getPatientsByDoctor(
    doctorId: number,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<PatientListItem>> {
    // Şimdilik tüm hastaları getir
    // TODO: Backend'e doctorId filtresi eklendiğinde güncelle
    return this.getPatients({
      pageNumber: page,
      pageSize,
    });
  },
};

