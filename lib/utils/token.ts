/**
 * Token utility functions for JWT management
 */

/**
 * Decodes JWT token payload without validation
 */
export function decodeTokenPayload(token: string): any {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch {
        return null;
    }
}

/**
 * Checks if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
    try {
        const payload = decodeTokenPayload(token);
        if (!payload || !payload.exp) return true;

        const exp = payload.exp * 1000; // Convert to milliseconds
        return Date.now() >= exp;
    } catch {
        return true;
    }
}

/**
 * Checks if token should be refreshed (less than 5 minutes remaining)
 */
export function shouldRefreshToken(token: string): boolean {
    try {
        const payload = decodeTokenPayload(token);
        if (!payload || !payload.exp) return true;

        const exp = payload.exp * 1000;
        const fiveMinutes = 5 * 60 * 1000;
        return Date.now() >= (exp - fiveMinutes);
    } catch {
        return true;
    }
}

/**
 * Gets token expiration time in milliseconds
 */
export function getTokenExpiry(token: string): number | null {
    try {
        const payload = decodeTokenPayload(token);
        if (!payload || !payload.exp) return null;
        return payload.exp * 1000;
    } catch {
        return null;
    }
}

/**
 * Extracts role from JWT token
 */
export function getRoleFromToken(token: string): string | undefined {
    try {
        const payload = decodeTokenPayload(token);
        if (!payload) return undefined;

        // Common claim names for role
        return payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
            || payload["role"]
            || payload["UserRole"];
    } catch {
        return undefined;
    }
}
