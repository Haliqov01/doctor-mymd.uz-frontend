"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit2, List } from "lucide-react";

interface ExaminationFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

export function ExaminationField({
  label,
  value,
  onChange,
  options,
  placeholder = "Tanlang...",
}: ExaminationFieldProps) {
  const [mode, setMode] = useState<"select" | "custom">("select");

  return (
    <div className="space-y-2 p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm transition-all">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-slate-700">{label}</Label>
        <div className="flex gap-0.5 bg-slate-100 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setMode("select")}
            className={`px-2.5 py-1.5 text-xs rounded-md transition-all ${
              mode === "select"
                ? "bg-teal-500 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-white"
            }`}
          >
            <List className="h-3 w-3 inline mr-1" />
            Tanlash
          </button>
          <button
            type="button"
            onClick={() => setMode("custom")}
            className={`px-2.5 py-1.5 text-xs rounded-md transition-all ${
              mode === "custom"
                ? "bg-teal-500 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-white"
            }`}
          >
            <Edit2 className="h-3 w-3 inline mr-1" />
            Yozish
          </button>
        </div>
      </div>

      {mode === "select" ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full bg-slate-50">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {options.map((option, idx) => (
              <SelectItem key={idx} value={option} className="cursor-pointer">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="O'z ta'rifingizni kiriting..."
          rows={2}
          className="w-full resize-none bg-slate-50"
        />
      )}
    </div>
  );
}
