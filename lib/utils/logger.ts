/**
 * Development Logger Utility
 * 
 * Provides type-safe logging that automatically disables in production
 * and adds contextual information to debug messages.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
    enabled?: boolean;
    prefix?: string;
    timestamp?: boolean;
}

class Logger {
    private isDevelopment: boolean;
    private enabled: boolean;
    private prefix: string;
    private showTimestamp: boolean;

    constructor(options: LoggerOptions = {}) {
        this.isDevelopment = process.env.NODE_ENV === 'development';
        this.enabled = options.enabled ?? this.isDevelopment;
        this.prefix = options.prefix ?? '';
        this.showTimestamp = options.timestamp ?? true;
    }

    private formatMessage(level: LogLevel, context: string, ...args: any[]): any[] {
        const parts: any[] = [];

        if (this.showTimestamp) {
            parts.push(`[${new Date().toLocaleTimeString()}]`);
        }

        if (this.prefix) {
            parts.push(`[${this.prefix}]`);
        }

        if (context) {
            parts.push(`[${context}]`);
        }

        return [...parts, ...args];
    }

    debug(context: string, ...args: any[]): void {
        if (!this.enabled) return;
        console.debug(...this.formatMessage('debug', context, ...args));
    }

    info(context: string, ...args: any[]): void {
        if (!this.enabled) return;
        console.info(...this.formatMessage('info', context, ...args));
    }

    warn(context: string, ...args: any[]): void {
        if (!this.enabled) return;
        console.warn(...this.formatMessage('warn', context, ...args));
    }

    error(context: string, ...args: any[]): void {
        // Errors are always logged, even in production
        console.error(...this.formatMessage('error', context, ...args));
    }

    group(label: string): void {
        if (!this.enabled) return;
        console.group(label);
    }

    groupEnd(): void {
        if (!this.enabled) return;
        console.groupEnd();
    }

    table(data: any): void {
        if (!this.enabled) return;
        console.table(data);
    }
}

// Default logger instance
export const logger = new Logger();

// Create scoped loggers for specific modules
export function createLogger(prefix: string, options?: Omit<LoggerOptions, 'prefix'>): Logger {
    return new Logger({ ...options, prefix });
}

// Convenience exports
export const apiLogger = createLogger('API');
export const authLogger = createLogger('Auth');
export const doctorLogger = createLogger('Doctor');
export const dashboardLogger = createLogger('Dashboard');
