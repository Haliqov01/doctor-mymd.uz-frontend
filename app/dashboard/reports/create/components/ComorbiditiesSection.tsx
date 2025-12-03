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
import { X, Edit2 } from "lucide-react";

interface ComorbiditiesSectionProps {
  comorbidities: string;
  onChange: (value: string) => void;
}

export function ComorbiditiesSection({
  comorbidities,
  onChange,
}: ComorbiditiesSectionProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Seçimleri ve custom text'i birleştirip parent'a gönder
  useEffect(() => {
    const all = [...selected];
    if (custom.trim()) {
      all.push(custom.trim());
    }
    onChange(all.join(", "));
  }, [selected, custom]);

  const handleSelect = (value: string) => {
    if (value && !selected.includes(value)) {
      setSelected([...selected, value]);
    }
  };

  const removeItem = (item: string) => {
    setSelected(selected.filter((c) => c !== item));
  };

  // Dropdown'da gösterilmeyecek öğeleri filtrele
  const availableOptions = EXAMINATION_OPTIONS.comorbidities.filter(
    (opt) => !selected.includes(opt)
  );

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700">Yondosh kasalliklar</Label>
      
      {/* Dropdown + Custom Button Row */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Select onValueChange={handleSelect} value="">
            <SelectTrigger className="w-full bg-white border-gray-200 focus:border-amber-500 focus:ring-amber-500">
              <SelectValue placeholder="Kasallik tanlang..." />
            </SelectTrigger>
            <SelectContent className="bg-white max-h-[250px]">
              {availableOptions.length > 0 ? (
                availableOptions.map((item) => (
                  <SelectItem 
                    key={item} 
                    value={item}
                    className="cursor-pointer hover:bg-amber-50"
                  >
                    {item}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-3 text-sm text-gray-500 text-center">
                  Barcha kasalliklar tanlangan
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
          className={`px-3 ${showCustomInput ? 'bg-amber-50 border-amber-300 text-amber-700' : ''}`}
        >
          <Edit2 className="h-4 w-4 mr-1" />
          Yozish
        </Button>
      </div>

      {/* Seçilen Kasalliklar - Tag/Chip Şeklinde */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
          {selected.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-800 text-sm rounded-full border border-amber-200"
            >
              {item}
              <button
                type="button"
                onClick={() => removeItem(item)}
                className="ml-1 hover:bg-amber-200 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Custom Input Alanı */}
      {showCustomInput && (
        <div className="space-y-2 p-3 bg-orange-50/50 rounded-lg border border-orange-100">
          <Label className="text-xs text-gray-600">Boshqa kasalliklar (qo'shimcha)</Label>
          <Textarea
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Qo'shimcha kasalliklarni yozing..."
            rows={2}
            className="resize-none bg-white border-gray-200 focus:border-orange-500 focus:ring-orange-500"
          />
        </div>
      )}

      {/* Hızlı Önizleme */}
      {(selected.length > 0 || custom) && (
        <div className="text-xs text-gray-500 italic">
          <span className="font-medium">Natija:</span> {comorbidities || "—"}
        </div>
      )}
    </div>
  );
}
