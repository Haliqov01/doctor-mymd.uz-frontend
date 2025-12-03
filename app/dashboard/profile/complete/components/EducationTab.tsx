"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Stethoscope } from "lucide-react";
import { ProfileFormData } from "../hooks/use-profile-form";
import { FileUploadZone } from "./FileUploadZone";

interface EducationTabProps {
  formData: ProfileFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  bachelorDiploma: File | null;
  setBachelorDiploma: (file: File | null) => void;
  masterDiploma: File | null;
  setMasterDiploma: (file: File | null) => void;
}

export function EducationTab({
  formData,
  handleInputChange,
  handleSelectChange,
  bachelorDiploma,
  setBachelorDiploma,
  masterDiploma,
  setMasterDiploma,
}: EducationTabProps) {
  return (
    <div className="space-y-6">
      {/* Bakalavr ta'limi */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white shadow-soft">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-green-600 rounded-lg flex items-center justify-center shadow-sm">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-neutral-900">
              Bakalavr ta'limi
            </CardTitle>
          </div>
          <CardDescription className="text-base text-neutral-600">
            Oliy tibbiy ta'lim ma'lumotlaringizni kiriting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Universitet va Mamlakat */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="bachelorUniversity" className="text-base font-semibold text-neutral-700">
                Universitet nomi <span className="text-red-600">*</span>
              </Label>
              <Input
                id="bachelorUniversity"
                name="bachelorUniversity"
                type="text"
                required
                value={formData.bachelorUniversity}
                onChange={handleInputChange}
                placeholder="Universitet nomini kiriting"
                className="h-12 text-base border-2 border-neutral-200 focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bachelorCountry" className="text-base font-semibold text-neutral-700">
                Mamlakat <span className="text-red-600">*</span>
              </Label>
              <Select
                value={formData.bachelorCountry}
                onValueChange={(value) => handleSelectChange("bachelorCountry", value)}
              >
                <SelectTrigger className="w-full h-12 text-base border-2">
                  <SelectValue placeholder="Mamlakatni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uzbekistan">O'zbekiston</SelectItem>
                  <SelectItem value="russia">Rossiya</SelectItem>
                  <SelectItem value="kazakhstan">Qozog'iston</SelectItem>
                  <SelectItem value="usa">AQSh</SelectItem>
                  <SelectItem value="uk">Buyuk Britaniya</SelectItem>
                  <SelectItem value="germany">Germaniya</SelectItem>
                  <SelectItem value="france">Fransiya</SelectItem>
                  <SelectItem value="turkey">Turkiya</SelectItem>
                  <SelectItem value="other">Boshqa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bitirgan sanasi */}
          <div className="space-y-2">
            <Label htmlFor="bachelorGraduationDate" className="text-base font-semibold text-neutral-700">
              Bitirgan sanasi <span className="text-red-600">*</span>
            </Label>
            <Input
              id="bachelorGraduationDate"
              name="bachelorGraduationDate"
              type="date"
              required
              value={formData.bachelorGraduationDate}
              onChange={handleInputChange}
              className="h-12 text-base border-2 border-neutral-200 focus:border-green-500 focus:ring-4 focus:ring-green-100"
            />
          </div>

          {/* Diplom yuklash */}
          <FileUploadZone
            label="Diplom"
            required
            file={bachelorDiploma}
            onUpload={(file) => setBachelorDiploma(file)}
            onRemove={() => setBachelorDiploma(null)}
            borderColor="border-neutral-300 hover:border-green-400"
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
        </CardContent>
      </Card>

      {/* Magistratura / Klinik ordinatura */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white shadow-soft">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-green-600 rounded-lg flex items-center justify-center shadow-sm">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-neutral-900">
              Magistratura / Klinik ordinatura
            </CardTitle>
          </div>
          <CardDescription className="text-base text-neutral-600">
            Ixtisoslashtirilgan tibbiy ta'lim ma'lumotlaringizni kiriting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Universitet va Mamlakat */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="masterUniversity" className="text-base font-semibold text-neutral-700">
                Universitet nomi <span className="text-red-600">*</span>
              </Label>
              <Input
                id="masterUniversity"
                name="masterUniversity"
                type="text"
                required
                value={formData.masterUniversity}
                onChange={handleInputChange}
                placeholder="Universitet nomini kiriting"
                className="h-12 text-base border-2 border-neutral-200 focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="masterCountry" className="text-base font-semibold text-neutral-700">
                Mamlakat <span className="text-red-600">*</span>
              </Label>
              <Select
                value={formData.masterCountry}
                onValueChange={(value) => handleSelectChange("masterCountry", value)}
              >
                <SelectTrigger className="w-full h-12 text-base border-2">
                  <SelectValue placeholder="Mamlakatni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uzbekistan">O'zbekiston</SelectItem>
                  <SelectItem value="russia">Rossiya</SelectItem>
                  <SelectItem value="kazakhstan">Qozog'iston</SelectItem>
                  <SelectItem value="usa">AQSh</SelectItem>
                  <SelectItem value="uk">Buyuk Britaniya</SelectItem>
                  <SelectItem value="germany">Germaniya</SelectItem>
                  <SelectItem value="france">Fransiya</SelectItem>
                  <SelectItem value="turkey">Turkiya</SelectItem>
                  <SelectItem value="other">Boshqa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ixtisoslik yo'nalishi */}
          <div className="space-y-2">
            <Label htmlFor="masterSpecialization" className="text-base font-semibold text-neutral-700">
              Ixtisoslik yo'nalishi <span className="text-red-600">*</span>
            </Label>
            <Input
              id="masterSpecialization"
              name="masterSpecialization"
              type="text"
              required
              value={formData.masterSpecialization}
              onChange={handleInputChange}
              placeholder="Masalan: Kardiologiya, Nevrologiya"
              className="h-12 text-base border-2 border-neutral-200 focus:border-green-500 focus:ring-4 focus:ring-green-100"
            />
          </div>

          {/* Bitirgan sanasi */}
          <div className="space-y-2">
            <Label htmlFor="masterGraduationDate" className="text-base font-semibold text-neutral-700">
              Bitirgan sanasi <span className="text-red-600">*</span>
            </Label>
            <Input
              id="masterGraduationDate"
              name="masterGraduationDate"
              type="date"
              required
              value={formData.masterGraduationDate}
              onChange={handleInputChange}
              className="h-12 text-base border-2 border-neutral-200 focus:border-green-500 focus:ring-4 focus:ring-green-100"
            />
          </div>

          {/* Diplom/Guvohnoma yuklash */}
          <FileUploadZone
            label="Diplom / Guvohnoma"
            required
            file={masterDiploma}
            onUpload={(file) => setMasterDiploma(file)}
            onRemove={() => setMasterDiploma(null)}
            borderColor="border-neutral-300 hover:border-green-400"
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
        </CardContent>
      </Card>
    </div>
  );
}

