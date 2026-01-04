"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Stethoscope, Loader2, CheckCircle2 } from "lucide-react";
import { authService } from "@/lib/services";
import { doctorService } from "@/lib/services/doctor.service";

// Uzmanlık alanları listesi
const SPECIALIZATIONS = [
  "Kardiolog",
  "Nevropatolog", 
  "Terapevt",
  "Pediatr",
  "Ginekolog",
  "Xirurg",
  "Oftalmolog",
  "Dermatolog",
  "Endokrinolog",
  "Gastroenterolog",
  "Pulmonolog",
  "Urolog",
  "Ortoped",
  "Otorinolaringolog (LOR)",
  "Psixiatr",
  "Onkolog",
  "Infeksionist",
  "Allergolog",
  "Revmatolog",
  "Nefrolog",
  "Boshqa",
];

export default function SimpleProfileCompletePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form state - backend'in istediği alanlar
  const [formData, setFormData] = useState({
    fullName: "",
    specialization: "",
    experienceYears: "",
    workplace: "",
    biography: "",
  });

  const [userId, setUserId] = useState<number | null>(null);
  const [existingDoctorId, setExistingDoctorId] = useState<number | null>(null);

  // Sayfa yüklendiğinde profil bilgilerini al
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await authService.getProfile();
        if (profile) {
          setUserId(profile.id);
          // İsim varsa doldur
          const name = `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
          if (name) {
            setFormData(prev => ({ ...prev, fullName: name }));
          }
        }

        // Mevcut doktor profili var mı kontrol et
        try {
          const { doctorResolver } = await import("@/lib/services/doctorResolver");
          const docId = await doctorResolver.resolve();
          if (docId) {
            setExistingDoctorId(docId);
            // Mevcut bilgileri yükle
            const doc = await doctorService.getDoctorById(docId);
            if (doc) {
              setFormData({
                fullName: doc.fullName || "",
                specialization: doc.specialization || "",
                experienceYears: doc.experienceYears?.toString() || "",
                workplace: doc.workplace || "",
                biography: doc.biography || "",
              });
            }
          }
        } catch (e) {
          console.log("No existing doctor profile");
        }
      } catch (e) {
        console.error("Profile load error:", e);
        setError("Profil yuklanmadi. Qaytadan login qiling.");
      } finally {
        setInitialLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.fullName.trim()) {
      setError("Ism familiya kiritilishi shart");
      return;
    }
    if (!formData.specialization) {
      setError("Mutaxassislik tanlanishi shart");
      return;
    }
    if (!userId) {
      setError("Foydalanuvchi topilmadi. Qaytadan login qiling.");
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        userId: userId,
        fullName: formData.fullName.trim(),
        specialization: formData.specialization,
        experienceYears: formData.experienceYears ? parseInt(formData.experienceYears) : 0,
        workplace: formData.workplace.trim() || undefined,
        biography: formData.biography.trim() || undefined,
      };

      // Güncelleme ise ID ekle
      if (existingDoctorId) {
        payload.id = existingDoctorId;
      }

      console.log("Saving doctor profile:", payload);
      const result = await doctorService.upsertDoctor(payload);
      console.log("Doctor profile saved:", result);

      if (result?.id) {
        // Cache doctor ID
        localStorage.setItem("doctor_id_cache", JSON.stringify({
          userId: userId,
          doctorId: result.id,
          timestamp: Date.now(),
        }));

        setSuccess(true);
        
        // 1.5 saniye sonra dashboard'a git
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (err: any) {
      console.error("Save error:", err);
      
      if (err.code === "DoctorAlreadyExist") {
        setError("Profil allaqachon mavjud. Sahifa yangilanmoqda...");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setError(err.message || "Xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-slate-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
        <div className="text-center">
          <CheckCircle2 className="h-16 w-16 text-teal-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Profil saqlandi!</h2>
          <p className="text-slate-600">Dashboard'ga yo'naltirilmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/[0.02] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/[0.02] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Doctor <span className="text-teal-600">MyMD</span>
          </h1>
        </div>

        <Card className="shadow-xl border-slate-200">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-slate-800">
              Profilni to'ldiring
            </CardTitle>
            <CardDescription className="text-base">
              Platformada faol bo'lish uchun ma'lumotlaringizni kiriting
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Ism Familiya <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="To'liq ismingiz"
                  disabled={loading}
                  className="h-12"
                />
              </div>

              {/* Specialization */}
              <div className="space-y-2">
                <Label htmlFor="specialization" className="text-sm font-medium">
                  Mutaxassislik <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.specialization}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, specialization: value }))}
                  disabled={loading}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Mutaxassislikni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALIZATIONS.map((spec) => (
                      <SelectItem key={spec} value={spec}>
                        {spec}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Experience Years */}
              <div className="space-y-2">
                <Label htmlFor="experienceYears" className="text-sm font-medium">
                  Tajriba (yil)
                </Label>
                <Input
                  id="experienceYears"
                  type="number"
                  min="0"
                  max="80"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData(prev => ({ ...prev, experienceYears: e.target.value }))}
                  placeholder="Masalan: 5"
                  disabled={loading}
                  className="h-12"
                />
              </div>

              {/* Workplace */}
              <div className="space-y-2">
                <Label htmlFor="workplace" className="text-sm font-medium">
                  Ish joyi
                </Label>
                <Input
                  id="workplace"
                  value={formData.workplace}
                  onChange={(e) => setFormData(prev => ({ ...prev, workplace: e.target.value }))}
                  placeholder="Klinika yoki shifoxona nomi"
                  disabled={loading}
                  className="h-12"
                />
              </div>

              {/* Biography */}
              <div className="space-y-2">
                <Label htmlFor="biography" className="text-sm font-medium">
                  Qisqacha o'zingiz haqingizda
                </Label>
                <Textarea
                  id="biography"
                  value={formData.biography}
                  onChange={(e) => setFormData(prev => ({ ...prev, biography: e.target.value }))}
                  placeholder="Tajribangiz, yutuqlaringiz..."
                  disabled={loading}
                  rows={3}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Saqlanmoqda...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Saqlash va Davom etish
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Skip link */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            className="text-sm text-slate-500 hover:text-red-600 transition-colors"
          >
            Chiqish va qaytadan login
          </button>
        </div>
      </div>
    </div>
  );
}
