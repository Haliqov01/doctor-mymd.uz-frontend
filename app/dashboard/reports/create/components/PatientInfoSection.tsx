"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PatientInfo } from "@/types/report";
import { EXAMINATION_OPTIONS } from "@/lib/examination-options";

interface PatientInfoSectionProps {
  patientInfo: PatientInfo;
  onChange: (info: PatientInfo) => void;
}

export function PatientInfoSection({
  patientInfo,
  onChange,
}: PatientInfoSectionProps) {
  const handleChange = (field: keyof PatientInfo, value: string) => {
    onChange({ ...patientInfo, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="fullName">F.I.Sh. (bemorning)</Label>
          <Input
            id="fullName"
            value={patientInfo.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="To'liq ism-familiya"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Tug'ilgan sanasi</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={patientInfo.dateOfBirth}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Manzil</Label>
          <Select
            value={patientInfo.address}
            onValueChange={(value) => handleChange("address", value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Shahar tanlang" />
            </SelectTrigger>
            <SelectContent className="bg-white max-h-[300px]">
              {EXAMINATION_OPTIONS.cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Jinsi</Label>
          <Select
            value={patientInfo.gender}
            onValueChange={(value) =>
              handleChange("gender", value as "Erkak" | "Ayol")
            }
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Tanlang" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {EXAMINATION_OPTIONS.gender.map((g) => (
                <SelectItem key={g} value={g.charAt(0).toUpperCase() + g.slice(1)}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

