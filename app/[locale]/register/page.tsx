"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  doctorRegistrationStep1Schema,
  type DoctorRegistrationStep1Input,
} from "@/lib/validations/auth";
import { authService } from "@/lib/services";
import { setStoredToken } from "@/lib/api-client";
import { Loader2, CheckCircle2, Stethoscope, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

type Step = 1 | 2;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  smsCode?: string;
  sessionId?: number;
}

export default function RegisterDoctorPage() {
  const router = useRouter();
  const t = useTranslations();

  // State
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorRegistrationStep1Input>({
    resolver: zodResolver(doctorRegistrationStep1Schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    }
  });

  // Step 1: User Info + Send SMS
  const handleStep1Submit = async (data: DoctorRegistrationStep1Input) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const formattedPhone = `+998${data.phoneNumber}`;

      // Call Create Session (Real API)
      const response = await authService.createSession(formattedPhone);

      if (!response.sessionId) {
        throw new Error("Sessiya yaratilmadi");
      }

      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: formattedPhone,
        sessionId: response.sessionId
      });

      setSuccessMessage("Tasdiqlash kodi telefoningizga yuborildi");
      setStep(2);

      // Start Countdown
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error("SMS Error:", err);
      // Parsing API Error
      const msg = err.message || "SMS yuborishda xatolik yuz berdi";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify SMS + Update Profile
  const handleStep2Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const smsCode = (e.currentTarget.elements.namedItem("smsCode") as HTMLInputElement).value;

    if (!smsCode || smsCode.length < 5) {
      setError("Iltimos, tasdiqlash kodini to'liq kiriting");
      setLoading(false);
      return;
    }

    if (!formData.sessionId) {
      setError("Sessiya xatosi. Iltimos qaytadan urining.");
      setStep(1);
      setLoading(false);
      return;
    }

    try {
      // 1. Verify Session
      const verifyResult = await authService.verifySession({
        sessionId: formData.sessionId,
        code: smsCode,
      });

      if (!verifyResult.accessToken) {
        throw new Error("Tasdiqlash muvaffaqiyatsiz bo'ldi.");
      }

      // Save Token (authService.verifySession already logs it, but we explicit here for clarity)
      setStoredToken(verifyResult.accessToken);

      // 2. Get Profile to get userId
      const profile = await authService.getProfile();

      if (!profile || !profile.id) {
        throw new Error("Profil ma'lumotlari olinmadi.");
      }

      // 3. Update Profile with Name and Email
      await authService.updateProfile({
        userId: profile.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phoneNumber
      });

      // 4. Basit doktor profili oluştur (sonra tamamlanacak)
      const { doctorService } = await import("@/lib/services/doctor.service");
      
      try {
        const doctorProfile = await doctorService.upsertDoctor({
          userId: profile.id,
          fullName: `${formData.firstName} ${formData.lastName}`,
          specialization: "Belirtilmemiş", // Profile complete'de güncellenecek
          experienceYears: 0,
        });
        console.log("Initial doctor profile created:", doctorProfile);
        
        // DoctorId'yi cache'le
        if (doctorProfile?.id) {
          localStorage.setItem("doctor_id_cache", JSON.stringify({
            userId: profile.id,
            doctorId: doctorProfile.id,
            timestamp: Date.now()
          }));
        }
      } catch (docErr: any) {
        // DoctorAlreadyExist hatası OK, devam et
        if (docErr.code !== "DoctorAlreadyExist") {
          console.warn("Doctor profile creation warning:", docErr.message);
        }
      }

      setSuccessMessage("Ro'yxatdan o'tish muvaffaqiyatli! Profil to'ldirish sahifasiga yo'naltirilmoqda...");

      // Redirect to Profile Complete (tek sayfa)
      setTimeout(() => {
        router.push("/dashboard/profile/complete");
      }, 1500);

    } catch (err: any) {
      console.error("Registration Error:", err);
      setError(err.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // Resend Code
  const handleResendCode = async () => {
    if (countdown > 0) return;

    setLoading(true);
    setError("");

    try {
      const response = await authService.createSession(formData.phoneNumber);

      if (response && response.sessionId) {
        setFormData(prev => ({ ...prev, sessionId: response.sessionId }));
        setSuccessMessage("Yangi tasdiqlash kodi yuborildi");

        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || "Kod yuborishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC] p-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/[0.02] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/[0.02] rounded-full blur-[100px]" />
      </div>

      <Card className="relative z-10 w-full max-w-md shadow-lg border-slate-200">
        <CardHeader>
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                <Stethoscope className="h-7 w-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-slate-800">MyMD<span className="text-teal-600">.uz</span></span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">Shifokor ro'yxatdan o'tish</CardTitle>
          <CardDescription className="text-base text-slate-500">
            {step === 1 && "Ma'lumotlaringizni kiriting"}
            {step === 2 && "SMS kodni tasdiqlang"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-semibold text-slate-700">
                {step}-qadam / 2
              </span>
              <span className="text-sm text-slate-500">
                {step === 1 && "Ma'lumotlar"}
                {step === 2 && "Tasdiqlash"}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-teal-500 to-teal-600 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${(step / 2) * 100}%` }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0" />
              <p className="text-sm font-medium text-teal-800">{successMessage}</p>
            </div>
          )}

          {/* Step 1: Info Form */}
          {step === 1 && (
            <form onSubmit={handleSubmit(handleStep1Submit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">Ism *</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    placeholder="Ismingiz"
                    disabled={loading}
                  />
                  {errors.firstName && (
                    <p className="text-sm font-medium text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">Familiya *</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    placeholder="Familiyangiz"
                    disabled={loading}
                  />
                  {errors.lastName && (
                    <p className="text-sm font-medium text-red-600">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">Elektron pochta *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="mail@example.com"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-sm font-medium text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-slate-700">Telefon raqami *</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                    +998
                  </div>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    {...register("phoneNumber")}
                    placeholder="901234567"
                    maxLength={9}
                    disabled={loading}
                    className="pl-14"
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="text-sm font-medium text-red-600">{errors.phoneNumber.message}</p>
                )}
                <p className="text-sm text-slate-500">
                  Tasdiqlash kodi ushbu raqamga SMS qilib yuboriladi
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Yuborilmoqda...
                  </>
                ) : (
                  "SMS kod yuborish"
                )}
              </Button>

              <div className="text-center pt-6 border-t border-slate-200">
                <p className="text-base text-slate-600">
                  Allaqachon ro'yxatdan o'tganmisiz?{" "}
                  <Link
                    href="/login"
                    className="text-teal-600 hover:text-teal-700 font-semibold underline-offset-4 hover:underline"
                  >
                    Tizimga kirish
                  </Link>
                </p>
              </div>

              <div className="text-center pt-2">
                <Link
                  href="/"
                  className="text-base text-slate-500 hover:text-teal-600 font-medium transition-colors"
                >
                  ← Asosiy sahifaga qaytish
                </Link>
              </div>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-6">
              <div className="text-center mb-6 p-4 bg-teal-50 border border-teal-200 rounded-xl">
                <p className="text-base text-slate-700">
                  <strong className="text-teal-700">{formData.phoneNumber}</strong> raqamiga yuborilgan kodni kiriting
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Test uchun kod: <code className="bg-slate-200 px-2 py-0.5 rounded font-mono">0123123</code>
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="smsCode" className="text-sm font-medium text-slate-700">Tasdiqlash kodi</Label>
                <Input
                  id="smsCode"
                  name="smsCode"
                  type="text"
                  placeholder="1234567"
                  disabled={loading}
                  className="h-16 text-center text-3xl tracking-widest font-mono"
                  autoFocus
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Tekshirilmoqda...
                  </>
                ) : (
                  "Ro'yxatdan o'tish"
                )}
              </Button>

              <div className="text-center pt-2">
                {countdown > 0 ? (
                  <p className="text-base text-slate-500">
                    Yangi kod yuborish uchun <strong className="text-teal-600">{countdown}</strong> soniya kuting
                  </p>
                ) : (
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendCode}
                    disabled={loading}
                    className="text-base text-teal-600 hover:text-teal-700 font-semibold"
                  >
                    Kodni qayta yuborish
                  </Button>
                )}
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={() => setStep(1)}
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Raqamni o'zgartirish
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

