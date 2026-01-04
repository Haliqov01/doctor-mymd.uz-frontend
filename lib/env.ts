/**
 * Environment Variables Validation
 * 
 * Validates and provides type-safe access to environment variables
 * using Zod schemas. Throws error on missing or invalid variables.
 */

import { z } from 'zod';

const envSchema = z.object({
    // Public environment variables (accessible in browser)
    NEXT_PUBLIC_API_URL: z.string().url({
        message: 'NEXT_PUBLIC_API_URL must be a valid URL'
    }),
    NEXT_PUBLIC_APP_URL: z.string().url({
        message: 'NEXT_PUBLIC_APP_URL must be a valid URL'
    }),

    // Node environment
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Parse and validate environment variables
function validateEnv() {
    try {
        return envSchema.parse({
            NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
            NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
            NODE_ENV: process.env.NODE_ENV,
        });
    } catch (err) {
        if (err instanceof z.ZodError) {
            const missingVars = err.issues.map(issue => `  - ${issue.path.join('.')}: ${issue.message}`).join('\n');
            throw new Error(
                `Invalid environment variables:\n${missingVars}\n\nPlease check your .env.local file.`
            );
        }
        throw err;
    }
}

// Export validated and type-safe environment variables
export const env = validateEnv();

// Type for environment variables
export type Env = z.infer<typeof envSchema>;

// Helper to check environment
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
