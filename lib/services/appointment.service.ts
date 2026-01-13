import { apiClient, API_ENDPOINTS } from "../api-client";
import {
  Appointment,
  PaginatedResponse,
  GetAppointmentsRequest,
  UpdateAppointmentStatusRequest,
  AppointmentStatus,
} from "@/types";

export const appointmentService = {
  // Randevuları listele
  async getAppointments(
    params: GetAppointmentsRequest
  ): Promise<PaginatedResponse<Appointment>> {
    return apiClient.post<PaginatedResponse<Appointment>>(
      API_ENDPOINTS.APPOINTMENT.GET_LIST,
      params
    );
  },

  // Tek randevu getir
  async getAppointmentById(appointmentId: number): Promise<Appointment> {
    return apiClient.get<Appointment>(
      `${API_ENDPOINTS.APPOINTMENT.GET_BY_ID}?appointmentId=${appointmentId}`
    );
  },

  // Randevu oluştur/güncelle
  async upsertAppointment(data: {
    doctorId: number;
    patientId: number;
    message?: string;
    scheduledDate: string;
    duration: number;
    id?: number;
  }): Promise<Appointment> {
    return apiClient.post<Appointment>(API_ENDPOINTS.APPOINTMENT.UPSERT, data);
  },

  // Randevu durumunu güncelle
  async updateStatus(data: UpdateAppointmentStatusRequest): Promise<Appointment> {
    return apiClient.post<Appointment>(
      API_ENDPOINTS.APPOINTMENT.UPDATE_STATUS,
      data
    );
  },

  // Randevuyu onayla
  async confirmAppointment(appointmentId: number): Promise<Appointment> {
    return this.updateStatus({
      appointmentId,
      status: AppointmentStatus.Approved,
    });
  },

  // Randevuyu reddet
  async rejectAppointment(
    appointmentId: number,
    notes?: string
  ): Promise<Appointment> {
    return this.updateStatus({
      appointmentId,
      status: AppointmentStatus.Rejected,
      notes,
    });
  },

  // Randevuyu tamamla
  async completeAppointment(appointmentId: number): Promise<Appointment> {
    return this.updateStatus({
      appointmentId,
      status: AppointmentStatus.Completed,
    });
  },

  // Randevuyu iptal et
  async cancelAppointment(appointmentId: number): Promise<boolean> {
    return apiClient.post<boolean>(
      `${API_ENDPOINTS.APPOINTMENT.CANCEL}?appointmentId=${appointmentId}`
    );
  },

  // Randevu aktivasyonunu değiştir
  async toggleActivation(appointmentId: number): Promise<boolean> {
    return apiClient.post<boolean>(
      `${API_ENDPOINTS.APPOINTMENT.TOGGLE_ACTIVATION}?appointmentId=${appointmentId}`
    );
  },

  // Doktora göre randevuları getir
  async getAppointmentsByDoctor(
    doctorId: number,
    status?: AppointmentStatus,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<Appointment>> {
    return this.getAppointments({
      doctorId,
      status,
      pageNumber: page,
      pageSize,
    });
  },

  // Hastaya göre randevuları getir
  async getAppointmentsByPatient(
    patientId: number,
    status?: AppointmentStatus,
    page: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedResponse<Appointment>> {
    return this.getAppointments({
      patientId,
      status,
      pageNumber: page,
      pageSize,
    });
  },
};










