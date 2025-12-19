"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EXAMINATION_OPTIONS } from "@/lib/examination-options";
import { useState, useEffect } from "react";
import { X, Plus, Edit2 } from "lucide-react";

interface ComplaintsSectionProps {
  complaints: string;
  onChange: (value: string) => void;
}

export function ComplaintsSection({
  complaints,
  onChange,
}: ComplaintsSectionProps) {
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
  const [customComplaint, setCustomComplaint] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Seçimleri ve custom text'i birleştirip parent'a gönder
  useEffect(() => {
    const allComplaints = [...selectedComplaints];
    if (customComplaint.trim()) {
      allComplaints.push(customComplaint.trim());
    }
    onChange(allComplaints.join(", "));
  }, [selectedComplaints, customComplaint]);

  const handleSelectComplaint = (value: string) => {
    if (value && !selectedComplaints.includes(value)) {
      setSelectedComplaints([...selectedComplaints, value]);
    }
  };

  const removeComplaint = (complaint: string) => {
    setSelectedComplaints(selectedComplaints.filter((c) => c !== complaint));
  };

  // Dropdown'da gösterilmeyecek (zaten seçilmiş) öğeleri filtrele
  const availableOptions = EXAMINATION_OPTIONS.complaints.filter(
    (opt) => !selectedComplaints.includes(opt)
  );

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">Shikoyatlar</Label>
      
      {/* Dropdown + Custom Button Row */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Select onValueChange={handleSelectComplaint} value="">
            <SelectTrigger className="w-full bg-white border-gray-200 focus:border-green-500 focus:ring-green-500">
              <SelectValue placeholder="Shikoyat tanlang..." />
            </SelectTrigger>
            <SelectContent className="bg-white max-h-[250px]">
              {availableOptions.length > 0 ? (
                availableOptions.map((complaint) => (
                  <SelectItem 
                    key={complaint} 
                    value={complaint}
                    className="cursor-pointer hover:bg-green-50"
                  >
                    {complaint}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-3 text-sm text-gray-500 text-center">
                  Barcha shikoyatlar tanlangan
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowCustomInput(!showCustomInput)}
          className={`px-3 ${showCustomInput ? 'bg-green-50 border-green-300 text-green-700' : ''}`}
        >
          <Edit2 className="h-4 w-4 mr-1" />
          Yozish
        </Button>
      </div>

      {/* Seçilen Şikayetler - Tag/Chip Şeklinde */}
      {selectedComplaints.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          {selectedComplaints.map((complaint) => (
            <span
              key={complaint}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-800 text-sm rounded-full border border-green-200"
            >
              {complaint}
              <button
                type="button"
                onClick={() => removeComplaint(complaint)}
                className="ml-1 hover:bg-green-200 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Custom Input Alanı */}
      {showCustomInput && (
        <div className="space-y-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
          <Label className="text-xs text-gray-600">Boshqa shikoyatlar (qo'shimcha)</Label>
          <Textarea
            value={customComplaint}
            onChange={(e) => setCustomComplaint(e.target.value)}
            placeholder="Qo'shimcha shikoyatlarni yozing..."
            rows={2}
            className="resize-none bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Hızlı Önizleme */}
      {(selectedComplaints.length > 0 || customComplaint) && (
        <div className="text-xs text-gray-500 italic">
          <span className="font-medium">Natija:</span> {complaints || "—"}
        </div>
      )}
    </div>
  );
}
