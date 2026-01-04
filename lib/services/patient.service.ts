import { apiClient, API_ENDPOINTS } from "../api-client";
import { PaginatedResponse, GetPatientsRequest } from "@/types";

interface PatientListItem {
  id: number;
  userId: number;
  fullName: string;
  gender: string;
  age: number;
}

interface PatientDetail {
  id: number;
  userId: number;
  fullName: string;
  gender: string;
  age: number;
  address?: string;
  additionalNotes?: string;
  documents?: {
    path: string;
    originalName: string;
    size: number;
    extension: string;
  }[];
}

interface UpsertPatientRequest {
  id?: number;
  userId?: number;
  fullName: string;
  gender: string;
  age: number;
  address?: string;
  additionalNotes?: string;
}

interface DocumentViewModel {
  id: number;
  fileName: string;
  fileType: string;
  categoryName?: string;
  uploadedAt: string;
  fileSize: number;
  downloadUrl?: string;
}

interface UploadDocumentRequest {
  patientId: number;
  file: File;
  fileType: string;
  categoryId?: number;
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
  async upsertPatient(data: UpsertPatientRequest): Promise<PatientListItem> {
    return apiClient.post<PatientListItem>(API_ENDPOINTS.PATIENT.UPSERT, data);
  },

  // Hasta aktivasyonunu değiştir
  async toggleActivation(patientId: number): Promise<PatientListItem> {
    return apiClient.post<PatientListItem>(
      `${API_ENDPOINTS.PATIENT.TOGGLE_ACTIVATION}?patientId=${patientId}`
    );
  },

  // Belge yükle
  async uploadDocument(data: UploadDocumentRequest): Promise<DocumentViewModel> {
    const formData = new FormData();
    formData.append("PatientId", data.patientId.toString());
    formData.append("File", data.file);
    formData.append("FileType", data.fileType);
    if (data.categoryId) {
      formData.append("CategoryId", data.categoryId.toString());
    }

    return apiClient.uploadFile<DocumentViewModel>(
      API_ENDPOINTS.PATIENT.UPLOAD_DOCUMENT,
      formData
    );
  },

  // Belgeleri getir
  async getDocuments(patientId: number): Promise<DocumentViewModel[]> {
    return apiClient.get<DocumentViewModel[]>(
      `${API_ENDPOINTS.PATIENT.GET_DOCUMENTS}?patientId=${patientId}`
    );
  },

  // Belge indir
  async downloadDocument(documentId: number): Promise<Blob> {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1${API_ENDPOINTS.PATIENT.DOWNLOAD_DOCUMENT}?documentId=${documentId}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );

    if (!response.ok) {
      throw new Error("Belge indirilemedi");
    }

    return response.blob();
  },

  // Belge sil
  async deleteDocument(documentId: number): Promise<boolean> {
    return apiClient.delete<boolean>(
      `${API_ENDPOINTS.PATIENT.DELETE_DOCUMENT}?documentId=${documentId}`
    );
  },

  /**
   * Doktora ait hastaları getir (randevular üzerinden)
   * Backend'de doctorId filtresi olmadığı için randevulardan hesaplanır
   */
  async getPatientsByDoctor(
    doctorId: number,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{ patients: PatientListItem[], totalCount: number }> {
    // Randevulardan unique patient'ları çek
    const { appointmentService } = await import("./appointment.service");
    
    const appointments = await appointmentService.getAppointments({
      doctorId: doctorId,
      pageNumber: 1,
      pageSize: 1000, // Tüm randevuları al
    });

    // Unique patient ID'leri çıkar
    const uniquePatientIds = [...new Set(
      (appointments.data || []).map(apt => apt.patientId)
    )];

    // Pagination uygula
    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const pagePatientIds = uniquePatientIds.slice(startIdx, endIdx);

    // Her patient için detay çek
    const patients: PatientListItem[] = [];
    for (const patientId of pagePatientIds) {
      try {
        const patient = await this.getPatientById(patientId);
        patients.push({
          id: patient.id,
          userId: patient.userId,
          fullName: patient.fullName,
          gender: patient.gender,
          age: patient.age,
        });
      } catch (e) {
        console.warn(`Patient ${patientId} not found`);
      }
    }

    return {
      patients,
      totalCount: uniquePatientIds.length,
    };
  },
};
