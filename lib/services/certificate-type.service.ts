import { apiClient, API_ENDPOINTS } from "../api-client";
import { PaginatedResponse, CertificateType, UpsertCertificateTypeRequest } from "@/types";

export interface GetCertificateTypesRequest {
  pageNumber: number;
  pageSize: number;
}

export const certificateTypeService = {
  // Sertifika türü oluştur/güncelle
  async upsertCertificateType(data: UpsertCertificateTypeRequest): Promise<CertificateType> {
    return apiClient.post<CertificateType>(
      API_ENDPOINTS.CERTIFICATE_TYPE.UPSERT,
      data
    );
  },

  // Tek sertifika türü getir
  async getCertificateTypeById(certificateTypeId: number): Promise<CertificateType> {
    return apiClient.get<CertificateType>(
      `${API_ENDPOINTS.CERTIFICATE_TYPE.GET_BY_ID}?certificateTypeId=${certificateTypeId}`
    );
  },

  // Sertifika türlerini listele
  async getCertificateTypes(
    params: GetCertificateTypesRequest
  ): Promise<PaginatedResponse<CertificateType>> {
    return apiClient.post<PaginatedResponse<CertificateType>>(
      API_ENDPOINTS.CERTIFICATE_TYPE.GET_LIST,
      params
    );
  },

  // Tüm sertifika türlerini getir (sayfalama olmadan)
  async getAllCertificateTypes(): Promise<PaginatedResponse<CertificateType>> {
    return this.getCertificateTypes({
      pageNumber: 1,
      pageSize: 1000,
    });
  },

  // Aktivasyon değiştir
  async toggleActivation(certificateTypeId: number): Promise<CertificateType> {
    return apiClient.post<CertificateType>(
      `${API_ENDPOINTS.CERTIFICATE_TYPE.TOGGLE_ACTIVATION}?certificateTypeId=${certificateTypeId}`
    );
  },
};

