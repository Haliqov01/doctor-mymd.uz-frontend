"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone } from "lucide-react";
import { ProfileFormData } from "../hooks/use-profile-form";

interface PersonalInfoTabProps {
  formData: ProfileFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PersonalInfoTab({ formData, handleInputChange }: PersonalInfoTabProps) {
  return (
    <div className="space-y-6">
      {/* Shaxsiy ma'lumotlar */}
      <Card className="border-2 border-green-100 bg-green-50/30">
        <CardHeader>
          <CardTitle className="text-lg text-green-700 flex items-center gap-2">
            <User className="h-5 w-5" />
            Shaxsiy ma'lumotlar
          </CardTitle>
          <CardDescription>
            To'liq ismingizni va elektron pochtangizni kiriting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ism */}
            <div className="space-y-2">
              <Label htmlFor="firstName">
                Ism <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Ismingizni kiriting"
              />
            </div>

            {/* Otasining ismi */}
            <div className="space-y-2">
              <Label htmlFor="middleName">
                Otasining ismi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="middleName"
                name="middleName"
                type="text"
                required
                value={formData.middleName}
                onChange={handleInputChange}
                placeholder="Otangizning ismini kiriting"
              />
            </div>

            {/* Familiya */}
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Familiya <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Familiyangizni kiriting"
              />
            </div>

            {/* E-pochta */}
            <div className="space-y-2">
              <Label htmlFor="email">
                E-pochta <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@example.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aloqa ma'lumotlari */}
      <Card className="border-2 border-blue-100 bg-blue-50/30">
        <CardHeader>
          <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Aloqa ma'lumotlari
          </CardTitle>
          <CardDescription>
            Telefon raqamlaringizni kiriting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mobil telefon */}
            <div className="space-y-2">
              <Label htmlFor="mobilePhone">
                Mobil telefon <span className="text-red-500">*</span>
              </Label>
              <Input
                id="mobilePhone"
                name="mobilePhone"
                type="tel"
                required
                value={formData.mobilePhone}
                onChange={handleInputChange}
                placeholder="+998 90 123 45 67"
              />
            </div>

            {/* Ish telefoni */}
            <div className="space-y-2">
              <Label htmlFor="workPhone">
                Ish telefoni
              </Label>
              <Input
                id="workPhone"
                name="workPhone"
                type="tel"
                value={formData.workPhone}
                onChange={handleInputChange}
                placeholder="+998 71 123 45 67"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

