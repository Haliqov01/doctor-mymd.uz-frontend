"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { doctorResolver } from "@/lib/services/doctorResolver";
import { authService } from "@/lib/services/auth.service";

interface DoctorContextType {
    doctorId: number | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

interface DoctorProviderProps {
    children: ReactNode;
}

/**
 * DoctorProvider
 * 
 * Provides the resolved doctorId globally throughout the app.
 * Automatically resolves on mount and when user changes.
 * 
 * Usage:
 * 1. Wrap your app/dashboard layout with <DoctorProvider>
 * 2. Use the useDoctorId() hook to access doctorId anywhere
 */
export function DoctorProvider({ children }: DoctorProviderProps) {
    const [doctorId, setDoctorId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDoctorId = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Check if user is logged in
            const token = localStorage.getItem("auth_token");
            if (!token) {
                setDoctorId(null);
                setIsLoading(false);
                return;
            }

            // Resolve doctor ID
            const resolvedId = await doctorResolver.resolve();

            if (resolvedId) {
                setDoctorId(resolvedId);
                console.log("[DoctorContext] Doctor ID resolved:", resolvedId);
            } else {
                setDoctorId(null);
                console.warn("[DoctorContext] Could not resolve doctor ID");
            }

        } catch (err: any) {
            console.error("[DoctorContext] Error resolving doctor ID:", err);
            setError(err.message || "Failed to resolve doctor ID");
            setDoctorId(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Resolve on mount
    useEffect(() => {
        fetchDoctorId();
    }, []);

    // Listen for profile updates (optional)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "auth_token") {
                // Token changed, re-resolve
                console.log("[DoctorContext] Auth token changed, re-resolving...");
                fetchDoctorId();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <DoctorContext.Provider
            value={{
                doctorId,
                isLoading,
                error,
                refetch: fetchDoctorId,
            }}
        >
            {children}
        </DoctorContext.Provider>
    );
}

/**
 * Hook to access doctor ID anywhere in the app
 * 
 * @example
 * const { doctorId, isLoading } = useDoctorId();
 * 
 * if (isLoading) return <Spinner />;
 * if (!doctorId) return <NotADoctor />;
 * 
 * // Use doctorId to fetch appointments, etc.
 * const appointments = await getAppointments({ doctorId });
 */
export function useDoctorId() {
    const context = useContext(DoctorContext);

    if (context === undefined) {
        throw new Error("useDoctorId must be used within DoctorProvider");
    }

    return context;
}
