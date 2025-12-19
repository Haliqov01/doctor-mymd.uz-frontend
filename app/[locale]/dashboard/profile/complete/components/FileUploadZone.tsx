"use client";

import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";

interface FileUploadZoneProps {
  label: string;
  required?: boolean;
  file: File | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  accept?: string;
  maxSize?: number;
  helperText?: string;
  borderColor?: string;
  bgColor?: string;
  iconColor?: string;
}

export function FileUploadZone({
  label,
  required = false,
  file,
  onUpload,
  onRemove,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSize = 5,
  helperText = "PDF, JPG yoki PNG (max 10MB)",
  borderColor = "border-gray-300 hover:border-green-400",
  bgColor = "bg-green-50",
  iconColor = "text-green-600",
}: FileUploadZoneProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file size
      if (selectedFile.size > maxSize * 1024 * 1024) {
        alert(`Fayl hajmi ${maxSize}MB dan oshmasligi kerak`);
        return;
      }
      // Check file type
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("Faqat PDF, JPG yoki PNG formatdagi fayllarni yuklash mumkin");
        return;
      }
      
      onUpload(selectedFile);
    }
  };

  const inputId = `file-upload-${label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {!file ? (
        <div className={`border-2 border-dashed ${borderColor} rounded-lg p-6 transition-colors cursor-pointer bg-white`}>
          <label
            htmlFor={inputId}
            className="flex flex-col items-center gap-2 cursor-pointer"
          >
            <Upload className="h-10 w-10 text-gray-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                {label} faylini yuklang
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {helperText}
              </p>
            </div>
            <input
              id={inputId}
              type="file"
              required={required}
              className="hidden"
              accept={accept}
              onChange={handleFileChange}
            />
          </label>
        </div>
      ) : (
        <div className={`flex items-center gap-3 p-4 ${bgColor} border ${borderColor.split(' ')[0].replace('hover:', '')} rounded-lg`}>
          <FileText className={`h-8 w-8 ${iconColor} flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {file.name}
            </p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      )}
    </div>
  );
}
