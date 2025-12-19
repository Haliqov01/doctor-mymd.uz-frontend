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
import { Loader2, CheckCircle2, Eye, EyeOff, Stethoscope } from "lucide-react";
import Link from "next/link";

type Step = 1 | 2 | 3;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  specialization: string;
  smsCode?: string;
  password?: string;
  passwordConfirm?: string;
}

export default function RegisterDoctorPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    specialization: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorRegistrationStep1Input>({
    resolver: zodResolver(doctorRegistrationStep1Schema),
  });

  // 1-qadam: Ma'lumot kiritish va SMS yuborish
  const handleStep1Submit = async (data: DoctorRegistrationStep1Input) => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/auth/send-sms-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: data.phoneNumber,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "SMS yuborilmadi");
      }

      setFormData({
        ...data,
      });
      setSuccessMessage("Tasdiqlash kodi telefoningizga yuborildi");
      setStep(2);
      
      // 60 soniya orqaga hisoblash
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
      setError(err.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // 2-qadam: SMS kodni tasdiqlash
  const handleStep2Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    const smsCode = (e.currentTarget.elements.namedItem("smsCode") as HTMLInputElement).value;

    if (smsCode.length !== 6) {
      setError("Iltimos, 6 xonali kodni kiriting");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/verify-sms-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          code: smsCode,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Kod tasdiqlanmadi");
      }

      setFormData({ ...formData, smsCode });
      setSuccessMessage("Telefon raqami tasdiqlandi");
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // 3-qadam: Parol belgilash va ro'yxatdan o'tishni tugatish
  const handleStep3Submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const password = (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value;
    const passwordConfirm = (e.currentTarget.elements.namedItem("passwordConfirm") as HTMLInputElement).value;

    if (password !== passwordConfirm) {
      setError("Parollar mos emas");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Parol kamida 8 ta belgi bo'lishi kerak");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register-doctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          specialization: formData.specialization,
          password,
          passwordConfirm,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Ro'yxatdan o'tishda xatolik");
      }

      setSuccessMessage("Ro'yxatdan o'tish muvaffaqiyatli! ,Profil'ga yo'naltirilmoqda...");
      
      // 2 soniyadan keyin doktor dashboard'ına yo'naltirish
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  // Kodni qayta yuborish
  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/auth/send-sms-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "SMS yuborilmadi");
      }

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
    } catch (err: any) {
      setError(err.message || "Xatolik yuz berdi");
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
            {step === 3 && "Parolingizni belgilang"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-semibold text-slate-700">
                {step}-qadam / 3
              </span>
              <span className="text-sm text-slate-500">
                {step === 1 && "Ma'lumotlar"}
                {step === 2 && "Tasdiqlash"}
                {step === 3 && "Xavfsizlik"}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-teal-500 to-teal-600 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Xatolik xabari */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {/* Muvaffaqiyat xabari */}
          {successMessage && (
            <div className="mb-4 p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-teal-600 flex-shrink-0" />
              <p className="text-sm font-medium text-teal-800">{successMessage}</p>
            </div>
          )}

          {/* 1-qadam: Ma'lumot kiritish */}
          {step === 1 && (
            <form onSubmit={handleSubmit(handleStep1Submit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">Ism *</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="Aziz"
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
                  placeholder="Karimov"
                  disabled={loading}
                />
                {errors.lastName && (
                  <p className="text-sm font-medium text-red-600">{errors.lastName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">Elektron pochta *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="misol@email.com"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-sm font-medium text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-slate-700">Telefon raqami *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  {...register("phoneNumber")}
                  placeholder="+998 90 123 45 67"
                  disabled={loading}
                />
                {errors.phoneNumber && (
                  <p className="text-sm font-medium text-red-600">{errors.phoneNumber.message}</p>
                )}
                <p className="text-sm text-slate-500">
                  SMS tasdiqlash kodi ushbu raqamga yuboriladi
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization" className="text-sm font-medium text-slate-700">Mutaxassislik *</Label>
                <Input
                  id="specialization"
                  {...register("specialization")}
                  placeholder="Oftalmolog, Kardiolog, ..."
                  disabled={loading}
                />
                {errors.specialization && (
                  <p className="text-sm font-medium text-red-600">{errors.specialization.message}</p>
                )}
                <p className="text-sm text-slate-500">
                  Profilni to'ldirish jarayonida litsenziya va hujjatlar talab qilinadi
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

          {/* 2-qadam: SMS tasdiqlash */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-6">
              <div className="text-center mb-6 p-4 bg-teal-50 border border-teal-200 rounded-xl">
                <p className="text-base text-slate-700">
                  <strong className="text-teal-700">{formData.phoneNumber}</strong> raqamiga yuborilgan 6 xonali kodni kiriting
                </p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="smsCode" className="text-sm font-medium text-slate-700">Tasdiqlash kodi</Label>
                <Input
                  id="smsCode"
                  name="smsCode"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  disabled={loading}
                  className="h-16 text-center text-3xl tracking-widest font-mono"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Tekshirilmoqda...
                  </>
                ) : (
                  "Kodni tasdiqlash"
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
                className="w-full"
                onClick={() => setStep(1)}
              >
                ← Orqaga
              </Button>
            </form>
          )}

          {/* 3-qadam: Parol belgilash */}
          {step === 3 && (
            <form onSubmit={handleStep3Submit} className="space-y-5">
              <div className="text-center mb-6 p-4 bg-teal-50 border border-teal-200 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <CheckCircle2 className="h-8 w-8 text-teal-600" />
                </div>
                <p className="text-base text-teal-800 font-semibold">
                  Telefon raqami tasdiqlandi
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">Parol *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Kamida 8 ta belgi"
                    disabled={loading}
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-slate-500">
                  Kamida 8 ta belgi, bitta katta harf, bitta kichik harf va bitta raqam
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordConfirm" className="text-sm font-medium text-slate-700">Parolni takrorlang *</Label>
                <div className="relative">
                  <Input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type={showPasswordConfirm ? "text" : "password"}
                    placeholder="Parolingizni qayta kiriting"
                    disabled={loading}
                    className="pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPasswordConfirm ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Ro'yxatdan o'tkazilmoqda...
                  </>
                ) : (
                  "Ro'yxatdan o'tishni tugatish"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

