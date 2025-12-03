import { apiClient, API_ENDPOINTS } from "../api-client";
import { PaginatedResponse } from "@/types";

interface ReportData {
  appointmentId: number;
  description?: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  file?: File;
}

interface Report {
  id: number;
  appointmentId: number;
  description?: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  filePath?: string;
  createdDate: string;
  updatedDate: string;
}

interface GetReportsRequest {
  pageNumber: number;
  pageSize: number;
  appointmentId?: number;
  doctorId?: number;
  patientId?: number;
  fromDate?: string;
  toDate?: string;
}

export const reportService = {
  // Rapor oluştur
  async createReport(data: ReportData): Promise<Report> {
    return apiClient.post<Report>(API_ENDPOINTS.APPOINTMENT.CREATE_REPORT, data);
  },

  // Tek rapor getir
  async getReport(reportId: number): Promise<Report> {
    return apiClient.get<Report>(
      `${API_ENDPOINTS.APPOINTMENT.GET_REPORT}?reportId=${reportId}`
    );
  },

  // Raporları listele
  async getReports(
    params: GetReportsRequest
  ): Promise<PaginatedResponse<Report>> {
    return apiClient.post<PaginatedResponse<Report>>(
      API_ENDPOINTS.APPOINTMENT.GET_REPORTS,
      params
    );
  },

  // Rapor dosyası yükle
  async uploadReportFile(reportId: number, file: File): Promise<any> {
    const formData = new FormData();
    formData.append("ReportId", reportId.toString());
    formData.append("File", file);

    return apiClient.uploadFile(
      API_ENDPOINTS.APPOINTMENT.UPLOAD_REPORT_FILE,
      formData
    );
  },

  // Rapor indir
  async downloadReport(reportId: number): Promise<Blob> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1${API_ENDPOINTS.APPOINTMENT.DOWNLOAD_REPORT}?reportId=${reportId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Rapor indirilemedi");
    }

    return response.blob();
  },

  // Rapor sil
  async deleteReport(reportId: number): Promise<boolean> {
    return apiClient.post<boolean>(
      `${API_ENDPOINTS.APPOINTMENT.DELETE_REPORT}?reportId=${reportId}`
    );
  },

  // Doktora göre raporları getir
  async getReportsByDoctor(
    doctorId: number,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<Report>> {
    return this.getReports({
      doctorId,
      pageNumber: page,
      pageSize,
    });
  },
};

