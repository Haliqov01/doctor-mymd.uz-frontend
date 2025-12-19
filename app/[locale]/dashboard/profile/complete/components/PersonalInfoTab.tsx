"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Mail } from "lucide-react";
import { ProfileFormData } from "../hooks/use-profile-form";

interface PersonalInfoTabProps {
  formData: ProfileFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PersonalInfoTab({ formData, handleInputChange }: PersonalInfoTabProps) {
  return (
    <div className="space-y-6">
      {/* Shaxsiy ma'lumotlar */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white shadow-soft">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-green-600 rounded-lg flex items-center justify-center shadow-sm">
              <User className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-neutral-900">
              Shaxsiy ma'lumotlar
            </CardTitle>
          </div>
          <CardDescription className="text-base text-neutral-600">
            To'liq ismingizni va elektron pochtangizni kiriting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Ism */}
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-base font-semibold text-neutral-700">
                Ism <span className="text-red-600">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Ismingizni kiriting"
                className="h-12 text-base border-2 border-neutral-200 focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
            </div>

            {/* Otasining ismi */}
            <div className="space-y-2">
              <Label htmlFor="middleName" className="text-base font-semibold text-neutral-700">
                Otasining ismi <span className="text-red-600">*</span>
              </Label>
              <Input
                id="middleName"
                name="middleName"
                type="text"
                required
                value={formData.middleName}
                onChange={handleInputChange}
                placeholder="Otangizning ismini kiriting"
                className="h-12 text-base border-2 border-neutral-200 focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
            </div>

            {/* Familiya */}
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-base font-semibold text-neutral-700">
                Familiya <span className="text-red-600">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Familiyangizni kiriting"
                className="h-12 text-base border-2 border-neutral-200 focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
            </div>

            {/* E-pochta */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold text-neutral-700">
                E-pochta <span className="text-red-600">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@example.com"
                className="h-12 text-base border-2 border-neutral-200 focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aloqa ma'lumotlari */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white shadow-soft">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-green-600 rounded-lg flex items-center justify-center shadow-sm">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-neutral-900">
              Aloqa ma'lumotlari
            </CardTitle>
          </div>
          <CardDescription className="text-base text-neutral-600">
            Telefon raqamlaringizni kiriting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Mobil telefon */}
            <div className="space-y-2">
              <Label htmlFor="mobilePhone" className="text-base font-semibold text-neutral-700">
                Mobil telefon <span className="text-red-600">*</span>
              </Label>
              <Input
                id="mobilePhone"
                name="mobilePhone"
                type="tel"
                required
                value={formData.mobilePhone}
                onChange={handleInputChange}
                placeholder="+998 90 123 45 67"
                className="h-12 text-base border-2 border-neutral-200 focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
            </div>

            {/* Ish telefoni */}
            <div className="space-y-2">
              <Label htmlFor="workPhone" className="text-base font-semibold text-neutral-700">
                Ish telefoni
              </Label>
              <Input
                id="workPhone"
                name="workPhone"
                type="tel"
                value={formData.workPhone}
                onChange={handleInputChange}
                placeholder="+998 71 123 45 67"
                className="h-12 text-base border-2 border-neutral-200 focus:border-green-500 focus:ring-4 focus:ring-green-100"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

