"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { Loader2, Eye, EyeOff, Stethoscope, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService } from "@/lib/services";
import { setStoredToken } from "@/lib/api-client";

const loginSchema = z.object({
  phone: z
    .string()
    .min(1, "Telefon raqamini kiriting"),
  password: z.string().min(1, "Parolni kiriting"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError("");

    try {
      const result = await authService.signIn({
        phone: data.phone,
        password: data.password,
      });

      // Token'ı kaydet
      if (result.token) {
        setStoredToken(result.token);
      }

      // Kullanıcı rolüne göre yönlendir
      const userRole = result.user?.role;
      if (userRole === "User") {
        router.push("/dashboard/patient");
      } else if (userRole === "Doctor") {
        router.push("/dashboard");
      } else if (userRole === "Admin") {
        alert("Admin paneli hali ishga tushirilmagan");
        router.push("/");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Login xatosi:", err);
      setError(err.message || "Telefon raqam yoki parol xato");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-green-100/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-soft-lg">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Doctor <span className="text-green-600">MyMD</span>
          </h1>
          <p className="text-base text-neutral-600">
            Shifokorlar uchun professional tizim
          </p>
        </div>

        <Card className="shadow-soft-xl border-neutral-200">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold text-neutral-900">
              Tizimga kirish
            </CardTitle>
            <CardDescription className="text-base text-neutral-600">
              Telefon raqamingiz va parolingizni kiriting
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form 
              onSubmit={handleSubmit(onSubmit)} 
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label 
                  htmlFor="phone" 
                  className="text-base font-semibold text-neutral-700"
                >
                  Telefon raqami *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  {...register("phone")}
                  disabled={loading}
                  className="h-12 text-base border-2 border-neutral-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 placeholder:text-neutral-400 text-neutral-900 rounded-lg"
                />
                {errors.phone && (
                  <p className="text-sm font-medium text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label 
                  htmlFor="password" 
                  className="text-base font-semibold text-neutral-700"
                >
                  Parol *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    disabled={loading}
                    className="h-12 text-base pr-12 border-2 border-neutral-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 placeholder:text-neutral-400 text-neutral-900 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-green-600 transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm font-medium text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-700">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl px-6 text-base font-semibold bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Yuklanmoqda...
                  </>
                ) : (
                  <>
                    Kirish
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>

              <div className="text-center pt-6 border-t border-neutral-200">
                <p className="text-base text-neutral-600">
                  Hali ro'yxatdan o'tmaganmisiz?{" "}
                  <Link
                    href="/register"
                    className="text-green-600 hover:text-green-700 font-semibold underline-offset-4 hover:underline"
                  >
                    Ro'yxatdan o'tish
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-base text-neutral-600 hover:text-green-600 font-medium transition-colors"
          >
            ← Asosiy sahifaga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
}
