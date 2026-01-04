/**
 * Centralized Error Handling
 * 
 * Provides standardized error classes and handling utilities
 * for API and application errors.
 */

export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public code?: string,
        public details?: any
    ) {
        super(message);
        this.name = 'ApiError';

        // Maintains proper stack trace for where error was thrown
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        }
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            code: this.code,
            details: this.details,
        };
    }
}

export class ValidationError extends Error {
    constructor(
        message: string,
        public fields?: Record<string, string[]>
    ) {
        super(message);
        this.name = 'ValidationError';

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError);
        }
    }
}

export class AuthenticationError extends ApiError {
    constructor(message = 'Authentication required') {
        super(message, 401, 'AUTH_REQUIRED');
        this.name = 'AuthenticationError';
    }
}

export class AuthorizationError extends ApiError {
    constructor(message = 'Insufficient permissions') {
        super(message, 403, 'FORBIDDEN');
        this.name = 'AuthorizationError';
    }
}

export class NotFoundError extends ApiError {
    constructor(resource: string) {
        super(`${resource} not found`, 404, 'NOT_FOUND');
        this.name = 'NotFoundError';
    }
}

/**
 * Converts unknown errors to ApiError instances
 */
export function handleApiError(error: unknown): ApiError {
    // Already an ApiError
    if (error instanceof ApiError) {
        return error;
    }

    // Standard Error
    if (error instanceof Error) {
        return new ApiError(error.message, 500, 'INTERNAL_ERROR');
    }

    // String error
    if (typeof error === 'string') {
        return new ApiError(error, 500, 'INTERNAL_ERROR');
    }

    // Object with message
    if (error && typeof error === 'object' && 'message' in error) {
        return new ApiError(
            String(error.message),
            'statusCode' in error ? Number(error.statusCode) : 500,
            'code' in error ? String(error.code) : 'INTERNAL_ERROR'
        );
    }

    // Unknown error type
    return new ApiError('An unexpected error occurred', 500, 'UNKNOWN_ERROR');
}

/**
 * Checks if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
    if (error instanceof Error) {
        return (
            error.message.includes('fetch') ||
            error.message.includes('network') ||
            error.message.includes('Failed to fetch')
        );
    }
    return false;
}

/**
 * Formats error message for user display
 */
export function getUserErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
        // Provide user-friendly messages for common errors
        switch (error.statusCode) {
            case 401:
                return 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
            case 403:
                return 'Bu işlem için yetkiniz yok.';
            case 404:
                return 'Aradığınız kayıt bulunamadı.';
            case 422:
                return 'Geçersiz veri girişi. Lütfen kontrol edin.';
            case 429:
                return 'Çok fazla istek gönderdiniz. Lütfen bekleyin.';
            case 500:
                return 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
            default:
                return error.message || 'Bilinmeyen bir hata oluştu';
        }
    }

    if (isNetworkError(error)) {
        return 'İnternet bağlantınızı kontrol edin.';
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Bir hata oluştu. Lütfen tekrar deneyin.';
}
