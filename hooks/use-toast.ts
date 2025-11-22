"use client";

import { useState, useCallback } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface ToasterToast extends Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToasterToast[]>([]);

  const toast = useCallback(
    ({ title, description, variant = "default", ...props }: Omit<ToasterToast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToasterToast = {
        id,
        title,
        description,
        variant,
        ...props,
      };

      setToasts((prevToasts) => [...prevToasts, newToast]);

      // Auto dismiss after 5 seconds
      setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
      }, 5000);

      return {
        id,
        dismiss: () => {
          setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
        },
      };
    },
    []
  );

  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== toastId));
    } else {
      setToasts([]);
    }
  }, []);

  return {
    toast,
    toasts,
    dismiss,
  };
}

