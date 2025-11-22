"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoIcon } from "lucide-react";
import { ProfileFormData } from "../hooks/use-profile-form";

interface SocialMediaTabProps {
  formData: ProfileFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
}

const socialMediaPlatforms = [
  { key: "facebook", label: "Facebook", },
  { key: "instagram", label: "Instagram",  },
  { key: "telegram", label: "Telegram",  },
  { key: "linkedin", label: "LinkedIn", },
  { key: "youtube", label: "YouTube" },
];

export function SocialMediaTab({
  formData,
  handleInputChange,
  handleSelectChange,
  handleCheckboxChange,
}: SocialMediaTabProps) {
  const showSocialInputs = formData.socialConsent !== "Rozi emasman";
  const showPublicCheckboxes = formData.socialConsent === "Ba'zilarini";

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <Card className="border-2 border-blue-100 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <InfoIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-900">Nima uchun kerak?</h3>
              <p className="text-sm text-blue-800">
                Ijtimoiy tarmoqlardagi sahifalaringizni ulashish bemorlar ishonchini
                oshiradi va sizning professional faoliyatingizni ko'rsatishga yordam beradi.
                Siz o'zingiz xohlagan sahifalaringizni tanlashingiz mumkin.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Consent Selection */}
      <Card className="border-2 border-green-100">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">
            Ijtimoiy tarmoqlar haqida ma'lumot
          </CardTitle>
          <CardDescription>
            Qaysi ijtimoiy tarmoqlar havolalarini ulashmoqchisiz?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Option 1: Roziman */}
          <label
            className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
              formData.socialConsent === "Roziman"
                ? "border-green-500 bg-green-50 shadow-sm"
                : "border-gray-200 hover:border-green-300 hover:bg-green-50/50"
            }`}
          >
            <input
              type="radio"
              name="socialConsent"
              value="Roziman"
              checked={formData.socialConsent === "Roziman"}
              onChange={(e) => handleSelectChange("socialConsent", e.target.value)}
              className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500 mt-1"
            />
            <div className="ml-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <span className="font-semibold text-gray-900">
                  Roziman - Barcha havolalarimni ulashaman
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Barcha ijtimoiy tarmoq sahifalaringiz bemorlar uchun ko'rinadi
              </p>
            </div>
          </label>

          {/* Option 2: Ba'zilarini */}
          <label
            className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
              formData.socialConsent === "Ba'zilarini"
                ? "border-blue-500 bg-blue-50 shadow-sm"
                : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
            }`}
          >
            <input
              type="radio"
              name="socialConsent"
              value="Ba'zilarini"
              checked={formData.socialConsent === "Ba'zilarini"}
              onChange={(e) => handleSelectChange("socialConsent", e.target.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-1"
            />
            <div className="ml-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                <span className="font-semibold text-gray-900">
                  Ba'zilarini taqdim qilaman - Tanlaganlarimni ulashaman
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Siz o'zingiz tanlagan sahifalaringizni ulashing
              </p>
            </div>
          </label>

          {/* Option 3: Rozi emasman */}
          <label
            className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
              formData.socialConsent === "Rozi emasman"
                ? "border-red-500 bg-red-50 shadow-sm"
                : "border-gray-200 hover:border-red-300 hover:bg-red-50/50"
            }`}
          >
            <input
              type="radio"
              name="socialConsent"
              value="Rozi emasman"
              checked={formData.socialConsent === "Rozi emasman"}
              onChange={(e) => handleSelectChange("socialConsent", e.target.value)}
              className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500 mt-1"
            />
            <div className="ml-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚫</span>
                <span className="font-semibold text-gray-900">
                  Rozi emasman - Hech qanday havola ulashmayman
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Ijtimoiy tarmoq havolalari ko'rinmaydi
              </p>
            </div>
          </label>
        </CardContent>
      </Card>

      {/* Social Media Links (Conditional) */}
      {showSocialInputs && (
        <Card className="border-2 border-purple-100 animate-in fade-in duration-300">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">
              Ijtimoiy tarmoq havolalari
            </CardTitle>
            <CardDescription>
              {showPublicCheckboxes
                ? "Ommaga ko'rsatiladigan sahifalaringizni belgilang"
                : "Barcha havolalar ommaga ko'rinadi"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {socialMediaPlatforms.map((platform) => {
              const urlKey = `${platform.key}Url` as keyof ProfileFormData;
              const publicKey = `${platform.key}Public` as keyof ProfileFormData;
              
              return (
                <div key={platform.key} className="space-y-2">
                  <Label htmlFor={urlKey}>
                    <span className="flex items-center gap-2">
                      <span className="text-xl"></span>
                      {platform.label}
                    </span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={urlKey}
                      name={urlKey}
                      type="url"
                      value={formData[urlKey] as string}
                      onChange={handleInputChange}
                      placeholder={`https://${platform.key}.com/username`}
                      className="flex-1"
                    />
                    {showPublicCheckboxes && (
                      <label className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={formData[publicKey] as boolean}
                          onChange={(e) =>
                            handleCheckboxChange(publicKey, e.target.checked)
                          }
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">Ommaga ko'rsatish</span>
                      </label>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

