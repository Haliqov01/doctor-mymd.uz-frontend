"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
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
import { Loader2, Stethoscope, ArrowRight, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService } from "@/lib/services";
import { setStoredToken } from "@/lib/api-client";
import { LanguageSwitcher } from "@/components/language-switcher";

// Step 1: Phone Validation
const phoneSchema = z.object({
  phone: z
    .string()
    .min(9, "Telefon raqamini to'liq kiriting")
    .max(9, "Telefon raqami 9 ta raqamdan oshmasligi kerak"),
});

type PhoneFormData = z.infer<typeof phoneSchema>;

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations();

  // State
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [otpCode, setOtpCode] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
  });

  // Step 1: Send SMS
  const onSendSms = async (data: PhoneFormData) => {
    setLoading(true);
    setError("");

    try {
      const formattedPhone = `+998${data.phone}`;
      const response = await authService.createSession(formattedPhone);

      if (response && response.sessionId) {
        setSessionId(response.sessionId);
        setPhoneNumber(formattedPhone);
        setStep(2);

        // Start countdown (60s)
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
      } else {
        throw new Error("Sessiya yaratilmadi");
      }
    } catch (err: any) {
      console.error("SMS Error:", err);
      // Backend error format handling could be improved
      setError(err.message || t('auth.login.errorInvalid'));
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const onVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 5) {
      setError("Tasdiqlash kodini kiriting");
      return;
    }

    if (!sessionId) {
      setError("Sessiya xatosi. Bosh sahifaga qaytib qaytadan urinib ko'ring.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await authService.verifySession({
        sessionId: sessionId,
        code: otpCode
      });

      console.log("Verify Session Result:", result);

      if (result.accessToken) {
        // 1. Save to LocalStorage (for API Client)
        setStoredToken(result.accessToken);

        // 2. Save to Cookie (for Middleware / SSR)
        document.cookie = `token=${result.accessToken}; path=/; max-age=86400; SameSite=Lax`;

        // 3. Fetch profile and check doctor status
        try {
          const profile = await authService.getProfile();
          console.log("Login Profile Fetched:", profile);

          // 4. Doktor profilini kontrol et
          const { doctorService } = await import("@/lib/services/doctor.service");
          
          try {
            const doctors = await doctorService.getDoctors({
              fullName: `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'x',
              specialization: "",
              pageNumber: 1,
              pageSize: 10
            });

            // UserId eşleşen doktoru bul
            let hasDoctor = false;
            for (const doc of doctors.data || []) {
              try {
                const detail = await doctorService.getDoctorById(doc.id);
                if (detail.userId === profile.id) {
                  hasDoctor = true;
                  // DoctorId'yi cache'le
                  localStorage.setItem("doctor_id_cache", JSON.stringify({
                    userId: profile.id,
                    doctorId: detail.id,
                    timestamp: Date.now()
                  }));
                  break;
                }
              } catch (e) {
                console.warn("Doctor detail check failed:", e);
              }
            }

            if (!hasDoctor) {
              console.log("No doctor profile found, redirecting to profile complete...");
              router.push("/dashboard/profile/complete");
              return;
            }
          } catch (docErr) {
            console.warn("Doctor check failed, redirecting to profile complete:", docErr);
            router.push("/dashboard/profile/complete");
            return;
          }

          console.log("Doctor profile found, redirecting to dashboard...");
          router.push("/dashboard");

        } catch (profileErr) {
          console.error("Profile fetch error after login:", profileErr);
          router.push("/dashboard/profile/complete");
        }
      } else {
        throw new Error("Token olinmadi");
      }

    } catch (err: any) {
      console.error("Verify Error:", err);
      // Detailed error message from backend if available
      setError(err.message || "Kod noto'g'ri yoki muddati tugagan");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    // Just re-use the phone number to create a new session
    const data: PhoneFormData = { phone: phoneNumber.replace("+998", "") };
    await onSendSms(data);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/[0.02] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/[0.02] rounded-full blur-[100px]" />
      </div>

      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher variant="compact" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Doctor <span className="text-teal-600">MyMD</span>
          </h1>
          <p className="text-base text-slate-500">
            {t('auth.login.subtitle')}
          </p>
        </div>

        <Card className="shadow-lg border-slate-200">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold text-slate-800">
              {t('auth.login.title')}
            </CardTitle>
            <CardDescription className="text-base text-slate-500">
              {step === 1 ? t('auth.login.description') : "Telefoningizga yuborilgan kodni kiriting"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {step === 1 ? (
              // STEP 1: Phone Input
              <form onSubmit={handleSubmit(onSendSms)} className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-slate-700"
                  >
                    {t('auth.login.phoneLabel')} *
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                      +998
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="901234567"
                      {...register("phone")}
                      disabled={loading}
                      maxLength={9}
                      className="pl-14"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm font-medium text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      {t('common.loading')}
                    </>
                  ) : (
                    <>
                      SMS kod olish
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              // STEP 2: OTP Input
              <form onSubmit={onVerifyOtp} className="space-y-6">
                <div className="text-center mb-6 p-4 bg-teal-50 border border-teal-200 rounded-xl">
                  <p className="text-base text-slate-700">
                    <strong className="text-teal-700">{phoneNumber}</strong> raqamiga yuborilgan kodni kiriting
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Test uchun kod: <code className="bg-slate-200 px-2 py-0.5 rounded font-mono">0123123</code>
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="otp" className="text-sm font-medium text-slate-700">Tasdiqlash kodi</Label>
                  <Input
                    id="otp"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    type="text"
                    // maxLength={6} // Removing rigid constraint to allow 7 if needed
                    placeholder="123456"
                    disabled={loading}
                    className="h-16 text-center text-3xl tracking-widest font-mono"
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Tekshirilmoqda...
                    </>
                  ) : (
                    <>
                      Kirish
                      <CheckCircle2 className="h-5 w-5 ml-2" />
                    </>
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
                  ← Raqamni o'zgartirish
                </Button>
              </form>
            )}

            <div className="text-center pt-6 border-t border-slate-200 mt-6">
              <p className="text-base text-slate-600">
                {t('auth.login.noAccount')}{" "}
                <Link
                  href="/register"
                  className="text-teal-600 hover:text-teal-700 font-semibold underline-offset-4 hover:underline"
                >
                  {t('auth.login.registerLink')}
                </Link>
              </p>
            </div>

            <div className="text-center mt-6">
              <Link
                href="/"
                className="text-base text-slate-500 hover:text-teal-600 font-medium transition-colors"
              >
                ← {t('auth.login.backToHome')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
