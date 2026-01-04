"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { ProfileFormData } from "../hooks/use-profile-form";

interface SpecializationTabProps {
  formData: ProfileFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTextareaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const specializationOptions = [
  { value: "kardiologiya", label: "Kardiologiya" },
  { value: "nevrologiya", label: "Nevrologiya" },
  { value: "pediatriya", label: "Pediatriya" },
  { value: "ginekologiya", label: "Ginekologiya" },
  { value: "terapiya", label: "Terapiya" },
  { value: "jarrohlik", label: "Jarrohlik" },
  { value: "ortopediya", label: "Ortopediya" },
  { value: "dermatologiya", label: "Dermatologiya" },
  { value: "oftalmologiya", label: "Oftalmologiya" },
  { value: "lor", label: "LOR (Otorinolaringologiya)" },
  { value: "urologiya", label: "Urologiya" },
  { value: "stomatologiya", label: "Stomatologiya" },
  { value: "endokrinologiya", label: "Endokrinologiya" },
  { value: "pulmonologiya", label: "Pulmonologiya" },
  { value: "gastroenterologiya", label: "Gastroenterologiya" },
  { value: "psixiatriya", label: "Psixiatriya" },
  { value: "onkologiya", label: "Onkologiya" },
  { value: "travmatologiya", label: "Travmatologiya" },
  { value: "other", label: "Boshqa" },
];

export function SpecializationTab({
  formData,
  handleInputChange,
  handleTextareaChange,
  handleSelectChange,
}: SpecializationTabProps) {
  const keywordTags = formData.keywords
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.length > 0);

  return (
    <div className="space-y-6">
      {/* Ixtisoslik yo'nalishlari */}
      <Card className="border-2 border-purple-100 bg-purple-50/30">
        <CardHeader>
          <CardTitle className="text-lg text-purple-700 flex items-center gap-2">
            Ixtisoslik yo'nalishlari
          </CardTitle>
          <CardDescription>
            Eng ustuvor yo'nalishni birinchi o'ringa qo'ying
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Asosiy yo'nalish */}
          <div className="space-y-2">
            <Label htmlFor="specialization1">
              <span className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-purple-600 text-white rounded-full text-sm font-bold">
                  1
                </span>
                Asosiy yo'nalish <span className="text-red-500">*</span>
              </span>
            </Label>
            <Select
              value={formData.specialization1}
              onValueChange={(value) => handleSelectChange("specialization1", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Asosiy ixtisoslik yo'nalishini tanlang" />
              </SelectTrigger>
              <SelectContent>
                {specializationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ikkinchi yo'nalish */}
          <div className="space-y-2">
            <Label htmlFor="specialization2">
              <span className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-purple-400 text-white rounded-full text-sm font-bold">
                  2
                </span>
                Ikkinchi yo'nalish{" "}
                <span className="text-sm text-gray-500 font-normal">(ixtiyoriy)</span>
              </span>
            </Label>
            <Select
              value={formData.specialization2}
              onValueChange={(value) => handleSelectChange("specialization2", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Ikkinchi ixtisoslik yo'nalishini tanlang" />
              </SelectTrigger>
              <SelectContent>
                {specializationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Uchinchi yo'nalish */}
          <div className="space-y-2">
            <Label htmlFor="specialization3">
              <span className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-purple-300 text-white rounded-full text-sm font-bold">
                  3
                </span>
                Uchinchi yo'nalish{" "}
                <span className="text-sm text-gray-500 font-normal">(ixtiyoriy)</span>
              </span>
            </Label>
            <Select
              value={formData.specialization3}
              onValueChange={(value) => handleSelectChange("specialization3", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Uchinchi ixtisoslik yo'nalishini tanlang" />
              </SelectTrigger>
              <SelectContent>
                {specializationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Kalit so'zlar */}
      <Card className="border-2 border-orange-100 bg-orange-50/30">
        <CardHeader>
          <CardTitle className="text-lg text-orange-700 flex items-center gap-2">
            🔑 Kalit so'zlar va amaliyotlar
          </CardTitle>
          <CardDescription>
            Qanday kasalliklarni davolashingiz va qaysi tibbiy muolajalarni bajarishingizni yozing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Keywords Textarea */}
          <div className="space-y-2">
            <Label htmlFor="keywords">
              Kalit so'zlar <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="keywords"
              name="keywords"
              rows={4}
              required
              value={formData.keywords}
              onChange={handleTextareaChange}
              placeholder="Masalan: yurak kasalliklari, hipertoniya, aritmiya, EKG, exokardiyografiya, holter monitoring..."
              className="flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
            <p className="text-xs text-gray-500 flex items-center gap-1">
              Kalit so'zlarni vergul bilan ajrating
            </p>
          </div>

          {/* Keywords Preview */}
          {keywordTags.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Ko'rinish:</Label>
              <div className="flex flex-wrap gap-2 p-4 bg-white border border-orange-200 rounded-lg min-h-[60px]">
                {keywordTags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ish joylari */}
      <Card className="border-2 border-green-100 bg-green-50/30">
        <CardHeader>
          <CardTitle className="text-lg text-green-700 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Ish joylari
          </CardTitle>
          <CardDescription>
            Ish joylaringizni kiriting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ish joyi #1 */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">
              Ish joyi #1 <span className="text-red-500">*</span>
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clinic1Name">
                  Klinika nomi <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="clinic1Name"
                  name="clinic1Name"
                  type="text"
                  required
                  value={formData.clinic1Name}
                  onChange={handleInputChange}
                  placeholder="Klinika nomini kiriting"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinic1Address">
                  Klinika manzili <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="clinic1Address"
                  name="clinic1Address"
                  type="text"
                  required
                  value={formData.clinic1Address}
                  onChange={handleInputChange}
                  placeholder="To'liq manzilni kiriting"
                />
              </div>
            </div>
          </div>

          {/* Ish joyi #2 */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900">
              Ish joyi #2{" "}
              <span className="text-sm text-gray-500 font-normal">(ixtiyoriy)</span>
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clinic2Name">Klinika nomi</Label>
                <Input
                  id="clinic2Name"
                  name="clinic2Name"
                  type="text"
                  value={formData.clinic2Name}
                  onChange={handleInputChange}
                  placeholder="Klinika nomini kiriting"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinic2Address">Klinika manzili</Label>
                <Input
                  id="clinic2Address"
                  name="clinic2Address"
                  type="text"
                  value={formData.clinic2Address}
                  onChange={handleInputChange}
                  placeholder="To'liq manzilni kiriting"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

