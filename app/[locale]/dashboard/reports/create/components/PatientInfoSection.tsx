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
import { User, MapPin, Calendar, Users } from "lucide-react";

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
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400" />
            F.I.Sh. (bemorning)
          </Label>
          <Input
            id="fullName"
            value={patientInfo.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="To'liq ism-familiya"
            className="bg-slate-50"
          />
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400" />
            Tug'ilgan sanasi
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={patientInfo.dateOfBirth}
            onChange={(e) => handleChange("dateOfBirth", e.target.value)}
            className="bg-slate-50"
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label htmlFor="address" className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-400" />
            Manzil
          </Label>
          <Select
            value={patientInfo.address}
            onValueChange={(value) => handleChange("address", value)}
          >
            <SelectTrigger className="bg-slate-50">
              <SelectValue placeholder="Shahar tanlang" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {EXAMINATION_OPTIONS.cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender" className="flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-400" />
            Jinsi
          </Label>
          <Select
            value={patientInfo.gender}
            onValueChange={(value) =>
              handleChange("gender", value as "Erkak" | "Ayol")
            }
          >
            <SelectTrigger className="bg-slate-50">
              <SelectValue placeholder="Tanlang" />
            </SelectTrigger>
            <SelectContent>
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
