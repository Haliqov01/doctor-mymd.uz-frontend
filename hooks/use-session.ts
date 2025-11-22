"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";

interface SessionData {
  user: User;
  token: string;
  profile?: any;
}

interface UseSessionReturn {
  session: SessionData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useSession(): UseSessionReturn {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/auth/session");
      
      if (!response.ok) {
        throw new Error("Session alınamadı");
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setSession(result.data);
      } else {
        setSession(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  return {
    session,
    loading,
    error,
    refetch: fetchSession,
  };
}

