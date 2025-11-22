"use client";

import { useState, useEffect } from "react";

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface WorkingHour {
  dayOfWeek: DayOfWeek;
  isActive: boolean;
  startTime: string;
  endTime: string;
  breakStart: string | null;
  breakEnd: string | null;
  slotDuration: number;
}

const defaultWorkingHours: WorkingHour[] = [
  {
    dayOfWeek: "MONDAY",
    isActive: true,
    startTime: "09:00",
    endTime: "18:00",
    breakStart: "13:00",
    breakEnd: "14:00",
    slotDuration: 30,
  },
  {
    dayOfWeek: "TUESDAY",
    isActive: true,
    startTime: "09:00",
    endTime: "18:00",
    breakStart: "13:00",
    breakEnd: "14:00",
    slotDuration: 30,
  },
  {
    dayOfWeek: "WEDNESDAY",
    isActive: true,
    startTime: "09:00",
    endTime: "18:00",
    breakStart: "13:00",
    breakEnd: "14:00",
    slotDuration: 30,
  },
  {
    dayOfWeek: "THURSDAY",
    isActive: true,
    startTime: "09:00",
    endTime: "18:00",
    breakStart: "13:00",
    breakEnd: "14:00",
    slotDuration: 30,
  },
  {
    dayOfWeek: "FRIDAY",
    isActive: true,
    startTime: "09:00",
    endTime: "18:00",
    breakStart: "13:00",
    breakEnd: "14:00",
    slotDuration: 30,
  },
  {
    dayOfWeek: "SATURDAY",
    isActive: false,
    startTime: "09:00",
    endTime: "13:00",
    breakStart: null,
    breakEnd: null,
    slotDuration: 30,
  },
  {
    dayOfWeek: "SUNDAY",
    isActive: false,
    startTime: "09:00",
    endTime: "13:00",
    breakStart: null,
    breakEnd: null,
    slotDuration: 30,
  },
];

export function useWorkingHours() {
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>(defaultWorkingHours);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchWorkingHours();
  }, []);

  const fetchWorkingHours = async () => {
    try {
      const response = await fetch("/api/doctor/working-hours");
      
      if (!response.ok) {
        console.log("Working hours API not ready:", response.status);
        setLoading(false);
        return;
      }

      const result = await response.json();

      if (result.success && result.data && result.data.length > 0) {
        setWorkingHours(result.data);
      }
    } catch (error) {
      console.log("Working hours API not available yet:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateDay = (dayOfWeek: DayOfWeek, updates: Partial<WorkingHour>) => {
    setWorkingHours((prev) =>
      prev.map((wh) =>
        wh.dayOfWeek === dayOfWeek ? { ...wh, ...updates } : wh
      )
    );
  };

  const toggleDay = (dayOfWeek: DayOfWeek) => {
    setWorkingHours((prev) =>
      prev.map((wh) =>
        wh.dayOfWeek === dayOfWeek ? { ...wh, isActive: !wh.isActive } : wh
      )
    );
  };

  const copyToAllDays = (dayOfWeek: DayOfWeek) => {
    const source = workingHours.find((wh) => wh.dayOfWeek === dayOfWeek);
    if (!source) return;

    setWorkingHours((prev) =>
      prev.map((wh) => ({
        ...wh,
        startTime: source.startTime,
        endTime: source.endTime,
        breakStart: source.breakStart,
        breakEnd: source.breakEnd,
        slotDuration: source.slotDuration,
      }))
    );
  };

  const applyTemplate = (template: "standard" | "halfday" | "morning" | "evening") => {
    const templates = {
      standard: {
        startTime: "09:00",
        endTime: "18:00",
        breakStart: "13:00",
        breakEnd: "14:00",
        slotDuration: 30,
      },
      halfday: {
        startTime: "09:00",
        endTime: "13:00",
        breakStart: null,
        breakEnd: null,
        slotDuration: 30,
      },
      morning: {
        startTime: "08:00",
        endTime: "13:00",
        breakStart: null,
        breakEnd: null,
        slotDuration: 30,
      },
      evening: {
        startTime: "14:00",
        endTime: "20:00",
        breakStart: "17:00",
        breakEnd: "17:30",
        slotDuration: 30,
      },
    };

    const templateData = templates[template];
    setWorkingHours((prev) =>
      prev.map((wh) => ({
        ...wh,
        ...templateData,
      }))
    );
  };

  const saveWorkingHours = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/doctor/working-hours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workingHours),
      });

      const result = await response.json();

      if (result.success) {
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message || "Xatolik yuz berdi" };
      }
    } catch (error) {
      console.error("Error saving working hours:", error);
      return { success: false, message: "Saqlashda xatolik yuz berdi" };
    } finally {
      setSaving(false);
    }
  };

  return {
    workingHours,
    loading,
    saving,
    updateDay,
    toggleDay,
    copyToAllDays,
    applyTemplate,
    saveWorkingHours,
  };
}

