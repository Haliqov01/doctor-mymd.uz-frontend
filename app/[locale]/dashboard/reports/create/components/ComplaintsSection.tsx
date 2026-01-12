"use client";

import { useTranslations } from "next-intl";
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
import { getLocalizedExaminationOptions } from "@/lib/localized-examination-options";
import { useState, useEffect, useMemo } from "react";
import { X, Edit2 } from "lucide-react";

interface ComplaintsSectionProps {
  complaints: string;
  onChange: (value: string) => void;
}

export function ComplaintsSection({
  complaints,
  onChange,
}: ComplaintsSectionProps) {
  const t = useTranslations();
  const localizedOptions = useMemo(() => getLocalizedExaminationOptions(t), [t]);
  
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
  const [customComplaint, setCustomComplaint] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

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

  const availableOptions = localizedOptions.complaints.filter(
    (opt) => !selectedComplaints.includes(opt)
  );

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-slate-700">{t('reports.create.complaintsLabel')}</Label>
      
      {/* Dropdown + Custom Button Row */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Select onValueChange={handleSelectComplaint} value="">
            <SelectTrigger className="w-full bg-slate-50">
              <SelectValue placeholder={t('reports.create.selectComplaint')} />
            </SelectTrigger>
            <SelectContent className="max-h-[250px]">
              {availableOptions.length > 0 ? (
                availableOptions.map((complaint) => (
                  <SelectItem 
                    key={complaint} 
                    value={complaint}
                    className="cursor-pointer"
                  >
                    {complaint}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-3 text-sm text-slate-500 text-center">
                  {t('reports.create.allComplaintsSelected')}
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
          className={`px-3 ${showCustomInput ? 'bg-teal-50 border-teal-300 text-teal-700' : 'hover:border-teal-300'}`}
        >
          <Edit2 className="h-4 w-4 mr-1" />
          {t('reports.create.write')}
        </Button>
      </div>

      {/* Selected Complaints Tags */}
      {selectedComplaints.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
          {selectedComplaints.map((complaint) => (
            <span
              key={complaint}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-100 text-teal-800 text-sm rounded-full border border-teal-200"
            >
              {complaint}
              <button
                type="button"
                onClick={() => removeComplaint(complaint)}
                className="ml-1 hover:bg-teal-200 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Custom Input */}
      {showCustomInput && (
        <div className="space-y-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
          <Label className="text-xs text-slate-600">{t('reports.create.otherComplaints')}</Label>
          <Textarea
            value={customComplaint}
            onChange={(e) => setCustomComplaint(e.target.value)}
            placeholder={t('reports.create.writeOtherComplaints')}
            rows={2}
            className="resize-none bg-white"
          />
        </div>
      )}

      {/* Preview */}
      {(selectedComplaints.length > 0 || customComplaint) && (
        <div className="text-xs text-slate-500 italic">
          <span className="font-medium">{t('reports.create.result')}:</span> {complaints || "—"}
        </div>
      )}
    </div>
  );
}
