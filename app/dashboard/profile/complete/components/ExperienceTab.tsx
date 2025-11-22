"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Briefcase, GraduationCap, Globe, Award, Plus, X } from "lucide-react";
import { ProfileFormData, InternationalTraining } from "../hooks/use-profile-form";
import { FileUploadZone } from "./FileUploadZone";

interface ExperienceTabProps {
  formData: ProfileFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  academicDegreeCertificate: File | null;
  setAcademicDegreeCertificate: (file: File | null) => void;
  categoryCertificate: File | null;
  setCategoryCertificate: (file: File | null) => void;
  internationalTraining: InternationalTraining[];
  handleTrainingChange: (id: number, field: string, value: string) => void;
  addTraining: () => void;
  removeTraining: (id: number) => void;
}

export function ExperienceTab({
  formData,
  handleInputChange,
  handleSelectChange,
  academicDegreeCertificate,
  setAcademicDegreeCertificate,
  categoryCertificate,
  setCategoryCertificate,
  internationalTraining,
  handleTrainingChange,
  addTraining,
  removeTraining,
}: ExperienceTabProps) {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-cyan-100 bg-cyan-50/30">
        <CardHeader>
          <CardTitle className="text-lg text-cyan-700 flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Kasbiy tajriba
          </CardTitle>
          <CardDescription>
            Mutaxassislik yo\'nalishingizda qancha yil tajribangiz bor?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="yearsOfExperience">
              Ixtisoslik bo\'yicha ish staji <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="yearsOfExperience"
                name="yearsOfExperience"
                type="number"
                min="0"
                max="70"
                required
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                placeholder="Misol: 15"
                className="max-w-[200px]"
              />
              <span className="text-sm font-medium text-gray-600">yil</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-indigo-100 bg-indigo-50/30">
        <CardHeader>
          <CardTitle className="text-lg text-indigo-700 flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Ilmiy daraja va malaka
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="academicDegree">Ilmiy unvon</Label>
            <Select
              value={formData.academicDegree}
              onValueChange={(value) => handleSelectChange("academicDegree", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Ilmiy unvoningizni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yo\'q">Yo\'q</SelectItem>
                <SelectItem value="Fan nomzodi">Fan nomzodi</SelectItem>
                <SelectItem value="Fan doktori">Fan doktori</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.academicDegree !== "Yo\'q" && (
            <FileUploadZone
              label="Ilmiy unvon diplomini yuklang"
              required
              file={academicDegreeCertificate}
              onUpload={(file) => setAcademicDegreeCertificate(file)}
              onRemove={() => setAcademicDegreeCertificate(null)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
