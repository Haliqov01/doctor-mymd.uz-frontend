import { apiClient, API_ENDPOINTS } from "../api-client";
import { PaginatedResponse, Report, GetReportsRequest } from "@/types";

export const reportService = {
  // Rapor oluştur (multipart/form-data)
  async createReport(data: {
    patientId: number;
    doctorId: number;
    reportText: string;
    appointmentId?: number;
    reportFile?: File;
    notes?: string;
  }): Promise<Report> {
    const formData = new FormData();
    formData.append("PatientId", data.patientId.toString());
    formData.append("DoctorId", data.doctorId.toString());
    formData.append("ReportText", data.reportText);
    
    if (data.appointmentId) {
      formData.append("AppointmentId", data.appointmentId.toString());
    }
    if (data.reportFile) {
      formData.append("ReportFile", data.reportFile);
    }
    if (data.notes) {
      formData.append("Notes", data.notes);
    }

    return apiClient.uploadFile<Report>(
      API_ENDPOINTS.APPOINTMENT.CREATE_REPORT,
      formData
    );
  },

  // Tek rapor getir
  async getReport(reportId: number): Promise<Report> {
    return apiClient.get<Report>(
      `${API_ENDPOINTS.APPOINTMENT.GET_REPORT}?reportId=${reportId}`
    );
  },

  // Raporları listele (GET request with query params)
  async getReports(params: GetReportsRequest): Promise<PaginatedResponse<Report>> {
    const queryParams = new URLSearchParams();
    
    if (params.patientId) queryParams.append("PatientId", params.patientId.toString());
    if (params.doctorId) queryParams.append("DoctorId", params.doctorId.toString());
    if (params.fromDate) queryParams.append("FromDate", params.fromDate);
    if (params.toDate) queryParams.append("ToDate", params.toDate);
    if (params.searchText) queryParams.append("SearchText", params.searchText);
    if (params.pageNumber) queryParams.append("PageNumber", params.pageNumber.toString());
    if (params.pageSize) queryParams.append("PageSize", params.pageSize.toString());
    if (params.all !== undefined) queryParams.append("All", params.all.toString());

    const queryString = queryParams.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.APPOINTMENT.GET_REPORTS}?${queryString}`
      : API_ENDPOINTS.APPOINTMENT.GET_REPORTS;

    return apiClient.get<PaginatedResponse<Report>>(url);
  },

  // Rapor dosyası yükle
  async uploadReportFile(data: {
    reportId: number;
    file: File;
    description?: string;
  }): Promise<Report> {
    const formData = new FormData();
    formData.append("ReportId", data.reportId.toString());
    formData.append("File", data.file);
    if (data.description) {
      formData.append("Description", data.description);
    }

    return apiClient.uploadFile<Report>(
      API_ENDPOINTS.APPOINTMENT.UPLOAD_REPORT_FILE,
      formData
    );
  },

  // Rapor indir
  async downloadReport(reportId: number): Promise<Blob> {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1${API_ENDPOINTS.APPOINTMENT.DOWNLOAD_REPORT}?reportId=${reportId}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );

    if (!response.ok) {
      throw new Error("Rapor indirilemedi");
    }

    return response.blob();
  },

  // Rapor sil (DELETE method)
  async deleteReport(reportId: number): Promise<boolean> {
    return apiClient.delete<boolean>(
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

  // Hastaya göre raporları getir
  async getReportsByPatient(
    patientId: number,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<Report>> {
    return this.getReports({
      patientId,
      pageNumber: page,
      pageSize,
    });
  },
};
