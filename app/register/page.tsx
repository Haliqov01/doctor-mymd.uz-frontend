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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-10 w-10 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">MyMD.uz</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Shifokor ro'yxatdan o'tish</CardTitle>
          <CardDescription>
            {step === 1 && "Ma'lumotlaringizni kiriting"}
            {step === 2 && "SMS kodni tasdiqlang"}
            {step === 3 && "Parolingizni belgilang"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {step}-qadam / 3
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Xatolik xabari */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Muvaffaqiyat xabari */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          )}

          {/* 1-qadam: Ma'lumot kiritish */}
          {step === 1 && (
            <form onSubmit={handleSubmit(handleStep1Submit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Ism *</Label>
                <Input
                  id="firstName"
                  {...register("firstName")}
                  placeholder="Aziz"
                  disabled={loading}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Familiya *</Label>
                <Input
                  id="lastName"
                  {...register("lastName")}
                  placeholder="Karimov"
                  disabled={loading}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Elektron pochta *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="misol@email.com"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Telefon raqami *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  {...register("phoneNumber")}
                  placeholder="+998 90 123 45 67"
                  disabled={loading}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  SMS tasdiqlash kodi ushbu raqamga yuboriladi
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Mutaxassislik *</Label>
                <Input
                  id="specialization"
                  {...register("specialization")}
                  placeholder="Oftalmolog, Kardiolog, ..."
                  disabled={loading}
                />
                {errors.specialization && (
                  <p className="text-sm text-red-600">{errors.specialization.message}</p>
                )}
                <p className="text-xs text-gray-500">
                Profilni to‘ldirish jarayonida litsenziya va hujjatlar talab qilinadi
                </p>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Yuborilmoqda...
                  </>
                ) : (
                  "SMS kod yuborish"
                )}
              </Button>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Allaqachon ro'yxatdan o'tganmisiz?{" "}
                  <Link
                    href="/login"
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Tizimga kirish
                  </Link>
                </p>
              </div>

              <div className="text-center pt-2">
                <Link
                  href="/"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  ← Bosh sahifaga qaytish
                </Link>
              </div>
            </form>
          )}

          {/* 2-qadam: SMS tasdiqlash */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">
                  <strong>{formData.phoneNumber}</strong> raqamiga yuborilgan 6
                  xonali kodni kiriting
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smsCode">Tasdiqlash kodi</Label>
                <Input
                  id="smsCode"
                  name="smsCode"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  disabled={loading}
                  className="text-center text-2xl tracking-widest"
                />
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Tekshirilmoqda...
                  </>
                ) : (
                  "Kodni tasdiqlash"
                )}
              </Button>

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-500">
                    Yangi kod yuborish uchun {countdown} soniya kuting
                  </p>
                ) : (
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResendCode}
                    disabled={loading}
                    className="text-green-600 hover:text-green-700"
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
                Orqaga
              </Button>
            </form>
          )}

          {/* 3-qadam: Parol belgilash */}
          {step === 3 && (
            <form onSubmit={handleStep3Submit} className="space-y-4">
              <div className="text-center mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-green-800 font-medium">
                  Telefon raqami tasdiqlandi
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Parol *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Kamida 8 ta belgi"
                    disabled={loading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Kamida 8 ta belgi, bitta katta harf, bitta kichik harf va bitta raqam bo'lishi kerak
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordConfirm">Parolni takrorlang *</Label>
                <div className="relative">
                  <Input
                    id="passwordConfirm"
                    name="passwordConfirm"
                    type={showPasswordConfirm ? "text" : "password"}
                    placeholder="Parolingizni qayta kiriting"
                    disabled={loading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPasswordConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

