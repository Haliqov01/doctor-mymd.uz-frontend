import { apiClient, API_ENDPOINTS } from "../api-client";
import { PaginatedResponse } from "@/types";

export interface DocumentCategory {
  id: number;
  keyWord?: string;
  valueRu?: string;
  valueUz?: string;
  valueUzl?: string;
  valueEn?: string;
  status: number;
}

export interface UpsertDocumentCategoryRequest {
  id?: number;
  keyWord?: string;
  valueRu?: string;
  valueUz?: string;
  valueUzl?: string;
  valueEn?: string;
}

export interface GetDocumentCategoriesRequest {
  pageNumber: number;
  pageSize: number;
}

export const documentCategoryService = {
  // Kategori oluştur/güncelle
  async upsertCategory(data: UpsertDocumentCategoryRequest): Promise<DocumentCategory> {
    return apiClient.post<DocumentCategory>(
      API_ENDPOINTS.DOCUMENT_CATEGORY.UPSERT,
      data
    );
  },

  // Tek kategori getir
  async getCategoryById(categoryId: number): Promise<DocumentCategory> {
    return apiClient.get<DocumentCategory>(
      `${API_ENDPOINTS.DOCUMENT_CATEGORY.GET_BY_ID}?documentCategoryId=${categoryId}`
    );
  },

  // Kategorileri listele
  async getCategories(
    params: GetDocumentCategoriesRequest
  ): Promise<PaginatedResponse<DocumentCategory>> {
    return apiClient.post<PaginatedResponse<DocumentCategory>>(
      API_ENDPOINTS.DOCUMENT_CATEGORY.GET_LIST,
      params
    );
  },

  // Tüm kategorileri getir (sayfalama olmadan)
  async getAllCategories(): Promise<PaginatedResponse<DocumentCategory>> {
    return this.getCategories({
      pageNumber: 1,
      pageSize: 1000, // Büyük bir sayı ile tümünü al
    });
  },

  // Aktivasyon değiştir
  async toggleActivation(categoryId: number): Promise<DocumentCategory> {
    return apiClient.post<DocumentCategory>(
      `${API_ENDPOINTS.DOCUMENT_CATEGORY.TOGGLE_ACTIVATION}?documentCategoryId=${categoryId}`
    );
  },
};

