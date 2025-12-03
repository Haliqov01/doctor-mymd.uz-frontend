"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
    <div className="space-y-2 p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:border-gray-200 transition-colors">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        <div className="flex gap-1 bg-white rounded-md p-0.5 border border-gray-200">
          <button
            type="button"
            onClick={() => setMode("select")}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              mode === "select"
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <List className="h-3 w-3 inline mr-1" />
            Tanlash
          </button>
          <button
            type="button"
            onClick={() => setMode("custom")}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              mode === "custom"
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Edit2 className="h-3 w-3 inline mr-1" />
            Yozish
          </button>
        </div>
      </div>

      {mode === "select" ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="w-full bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="max-h-[400px] bg-white">
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
          className="w-full resize-none bg-white border-gray-200 focus:border-green-500 focus:ring-green-500"
        />
      )}
    </div>
  );
}

