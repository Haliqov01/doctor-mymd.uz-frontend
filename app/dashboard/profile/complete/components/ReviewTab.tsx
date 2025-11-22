"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { ProfileFormData, InternationalTraining } from "../hooks/use-profile-form";

interface ReviewTabProps {
  formData: ProfileFormData;
  bachelorDiploma: File | null;
  masterDiploma: File | null;
  academicDegreeCertificate: File | null;
  categoryCertificate: File | null;
  internationalTraining: InternationalTraining[];
}

export function ReviewTab({
  formData,
  bachelorDiploma,
  masterDiploma,
  academicDegreeCertificate,
  categoryCertificate,
  internationalTraining,
}: ReviewTabProps) {
  // Check which sections are complete
  const personalComplete =
    formData.firstName && formData.middleName && formData.lastName && formData.email && formData.mobilePhone;
  
  const educationComplete =
    formData.bachelorUniversity &&
    formData.bachelorCountry &&
    formData.bachelorGraduationDate &&
    bachelorDiploma &&
    formData.masterUniversity &&
    formData.masterCountry &&
    formData.masterSpecialization &&
    formData.masterGraduationDate &&
    masterDiploma;
  
  const experienceComplete = formData.yearsOfExperience !== "";
  
  const specializationComplete =
    formData.specialization1 && formData.keywords && formData.clinic1Name && formData.clinic1Address;

  const allComplete = personalComplete && educationComplete && experienceComplete && specializationComplete;

  const InfoRow = ({ label, value }: { label: string; value: string | undefined }) => {
    return value ? (
      <div className="grid grid-cols-3 gap-4 py-2 border-b last:border-b-0">
        <span className="text-sm font-medium text-gray-600">{label}:</span>
        <span className="col-span-2 text-sm text-gray-900">{value}</span>
      </div>
    ) : null;
  };

  return (
    <div className="space-y-6">
      {/* Completion Status */}
      <Card className={`border-2 ${allComplete ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}`}>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            {allComplete ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900">Profil to'ldirildi!</h3>
                  <p className="text-sm text-green-800 mt-1">
                    Barcha majburiy maydonlar to'ldirildi. Endi profilingizni saqlashingiz mumkin.
                  </p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-yellow-900">Profil to'liq emas</h3>
                  <p className="text-sm text-yellow-800 mt-1">
                    Iltimos, barcha majburiy maydonlarni to'ldiring
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section Status */}
      <Card>
        <CardHeader>
          <CardTitle>Bo'limlar holati</CardTitle>
          <CardDescription>Har bir bo'limning to'ldirilish holati</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            {personalComplete ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
            <span className="text-sm font-medium">Shaxsiy ma'lumotlar</span>
          </div>
          <div className="flex items-center gap-3">
            {educationComplete ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
            <span className="text-sm font-medium">Ta'lim ma'lumotlari</span>
          </div>
          <div className="flex items-center gap-3">
            {experienceComplete ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
            <span className="text-sm font-medium">Kasbiy tajriba</span>
          </div>
          <div className="flex items-center gap-3">
            {specializationComplete ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
            <span className="text-sm font-medium">Ixtisoslik</span>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info Summary */}
      {personalComplete && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">👤 Shaxsiy ma'lumotlar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow label="F.I.O" value={`${formData.lastName} ${formData.firstName} ${formData.middleName}`} />
            <InfoRow label="E-pochta" value={formData.email} />
            <InfoRow label="Telefon" value={formData.mobilePhone} />
            {formData.workPhone && <InfoRow label="Ish telefoni" value={formData.workPhone} />}
          </CardContent>
        </Card>
      )}

      {/* Education Summary */}
      {educationComplete && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🎓 Ta'lim ma'lumotlari</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-semibold text-gray-700">Bakalavr:</Label>
              <div className="mt-1 space-y-1">
                <InfoRow label="Universitet" value={formData.bachelorUniversity} />
                <InfoRow label="Mamlakat" value={formData.bachelorCountry} />
                <InfoRow label="Bitirgan sana" value={formData.bachelorGraduationDate} />
                {bachelorDiploma && <InfoRow label="Diplom" value={bachelorDiploma.name} />}
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700">Magistratura:</Label>
              <div className="mt-1 space-y-1">
                <InfoRow label="Universitet" value={formData.masterUniversity} />
                <InfoRow label="Mamlakat" value={formData.masterCountry} />
                <InfoRow label="Ixtisoslik" value={formData.masterSpecialization} />
                <InfoRow label="Bitirgan sana" value={formData.masterGraduationDate} />
                {masterDiploma && <InfoRow label="Diplom" value={masterDiploma.name} />}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Experience Summary */}
      {experienceComplete && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">💼 Kasbiy tajriba</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow label="Ish staji" value={`${formData.yearsOfExperience} yil`} />
            {formData.academicDegree !== "Yo'q" && (
              <>
                <InfoRow label="Ilmiy unvon" value={formData.academicDegree} />
                {academicDegreeCertificate && <InfoRow label="Diplom" value={academicDegreeCertificate.name} />}
              </>
            )}
            {formData.professionalCategory !== "Yo'q" && (
              <>
                <InfoRow label="Malaka toifasi" value={formData.professionalCategory} />
                {categoryCertificate && <InfoRow label="Guvohnoma" value={categoryCertificate.name} />}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Specialization Summary */}
      {specializationComplete && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🎯 Ixtisoslik</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <InfoRow label="Asosiy yo'nalish" value={formData.specialization1} />
            {formData.specialization2 && <InfoRow label="Ikkinchi yo'nalish" value={formData.specialization2} />}
            {formData.specialization3 && <InfoRow label="Uchinchi yo'nalish" value={formData.specialization3} />}
            <div className="py-2 border-b">
              <span className="text-sm font-medium text-gray-600">Kalit so'zlar:</span>
              <p className="text-sm text-gray-900 mt-1">{formData.keywords}</p>
            </div>
            <InfoRow label="Klinika #1" value={`${formData.clinic1Name}, ${formData.clinic1Address}`} />
            {formData.clinic2Name && (
              <InfoRow label="Klinika #2" value={`${formData.clinic2Name}, ${formData.clinic2Address}`} />
            )}
          </CardContent>
        </Card>
      )}

      {/* Terms and Conditions */}
      <Card className="border-2 border-gray-200">
        <CardContent className="pt-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-0.5"
            />
            <span className="text-sm text-gray-700">
              Men barcha ma'lumotlarim to'g'ri ekanligini tasdiqlayman va{" "}
              <a href="#" className="text-green-600 hover:underline">
                foydalanish shartlari
              </a>{" "}
              hamda{" "}
              <a href="#" className="text-green-600 hover:underline">
                maxfiylik siyosati
              </a>{" "}
              bilan tanishdim va roziman.
            </span>
          </label>
        </CardContent>
      </Card>
    </div>
  );
}

