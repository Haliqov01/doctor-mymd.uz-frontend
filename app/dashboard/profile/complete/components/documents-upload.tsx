"use client";


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap } from "lucide-react";
// @ts-ignore
import type { ProfileFormData } from "../hooks/useProfileForm";
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
      <Card className="border-2 border-green-100 bg-green-50/30">
        <CardHeader>
          <CardTitle className="text-lg text-green-700 flex items-center gap-2">
            Bakalavr ta'limi
          </CardTitle>
          <CardDescription>
            Oliy tibbiy ta'lim ma'lumotlaringizni kiriting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Universitet va Mamlakat */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bachelorUniversity">
                Universitet nomi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="bachelorUniversity"
                name="bachelorUniversity"
                type="text"
                required
                value={formData.bachelorUniversity}
                onChange={handleInputChange}
                placeholder="Universitet nomini kiriting"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bachelorCountry">
                Mamlakat <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.bachelorCountry}
                onValueChange={(value) => handleSelectChange("bachelorCountry", value)}
              >
                <SelectTrigger className="w-full">
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
            <Label htmlFor="bachelorGraduationDate">
              Bitirgan sanasi <span className="text-red-500">*</span>
            </Label>
            <Input
              id="bachelorGraduationDate"
              name="bachelorGraduationDate"
              type="date"
              required
              value={formData.bachelorGraduationDate}
              onChange={handleInputChange}
            />
          </div>

          {/* Diplom yuklash */}
          <FileUploadZone
            label="Diplom"
            required
            file={bachelorDiploma}
            onUpload={(file) => setBachelorDiploma(file)}
            onRemove={() => setBachelorDiploma(null)}
            borderColor="border-gray-300 hover:border-green-400"
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
        </CardContent>
      </Card>

      {/* Magistratura / Klinik ordinatura */}
      <Card className="border-2 border-blue-100 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
            Magistratura / Klinik ordinatura
          </CardTitle>
          <CardDescription>
            Ixtisoslashtirilgan tibbiy ta'lim ma'lumotlaringizni kiriting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Universitet va Mamlakat */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="masterUniversity">
                Universitet nomi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="masterUniversity"
                name="masterUniversity"
                type="text"
                required
                value={formData.masterUniversity}
                onChange={handleInputChange}
                placeholder="Universitet nomini kiriting"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="masterCountry">
                Mamlakat <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.masterCountry}
                onValueChange={(value) => handleSelectChange("masterCountry", value)}
              >
                <SelectTrigger className="w-full">
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
            <Label htmlFor="masterSpecialization">
              Ixtisoslik yo'nalishi <span className="text-red-500">*</span>
            </Label>
            <Input
              id="masterSpecialization"
              name="masterSpecialization"
              type="text"
              required
              value={formData.masterSpecialization}
              onChange={handleInputChange}
              placeholder="Masalan: Kardiologiya, Nevrologiya"
            />
          </div>

          {/* Bitirgan sanasi */}
          <div className="space-y-2">
            <Label htmlFor="masterGraduationDate">
              Bitirgan sanasi <span className="text-red-500">*</span>
            </Label>
            <Input
              id="masterGraduationDate"
              name="masterGraduationDate"
              type="date"
              required
              value={formData.masterGraduationDate}
              onChange={handleInputChange}
            />
          </div>

          {/* Diplom/Guvohnoma yuklash */}
          <FileUploadZone
            label="Diplom / Guvohnoma"
            required
            file={masterDiploma}
            onUpload={(file) => setMasterDiploma(file)}
            onRemove={() => setMasterDiploma(null)}
            borderColor="border-gray-300 hover:border-blue-400"
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
        </CardContent>
      </Card>
    </div>
  );
}

