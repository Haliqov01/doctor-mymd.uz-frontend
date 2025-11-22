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
import { Loader2, Eye, EyeOff, Heart } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "Telefon raqamini kiriting"),
    // .regex(/^\+998\d{9}$/, "To'g'ri format: +998XXXXXXXXX"), // Development için devre dışı
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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Telefon raqam yoki parol xato");
        return;
      }

      const userRole = result.data?.user?.role;
      if (userRole === "PATIENT") {
        router.push("/dashboard/patient");
      } else if (userRole === "DOCTOR") {
        router.push("/dashboard");
      } else if (userRole === "ADMIN") {
        // ADMIN dashboard henüz oluşturulmadı
        alert("Admin paneli hali ishga tushirilmagan");
        router.push("/");
      } else {
        router.push("/dashboard/patient");
      }
    } catch (err) {
      console.error("Login xatosi:", err);
      setError("Kutilmagan xato yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-teal-100">
        <CardHeader className="space-y-4 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-t-xl">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-bold text-white">MyMD.uz</span>
            </div>
          </div>
          <div className="text-center">
            <CardTitle className="text-2xl text-white">Tizimga kirish</CardTitle>
            <CardDescription className="text-teal-50">
              Telefon raqamingiz va parolingizni kiriting
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* 🧪 DEVELOPMENT TEST BANNER */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-4 p-4 bg-amber-50 border-2 border-amber-300 rounded-lg shadow-sm">
              <p className="text-xs font-bold text-amber-900 mb-2">🧪 TEST MODE - Development</p>
              <div className="text-xs text-amber-800 space-y-1">
                <p className="font-semibold">En kolay giriş:</p>
                <p className="font-mono bg-amber-100 px-2 py-1 rounded border border-amber-200">Telefon: <strong>doctor</strong></p>
                <p className="font-mono bg-amber-100 px-2 py-1 rounded border border-amber-200">Şifre: <strong>123</strong></p>
                <p className="text-[10px] mt-2 text-amber-700">
                  ℹ️ Herhangi bir telefon + şifre kabul edilir (Mock API)
                </p>
              </div>
            </div>
          )}
          
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-gray-700 font-semibold">Telefon raqami *</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="doctor"
                {...register("phoneNumber")}
                disabled={loading}
                className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 placeholder:text-gray-400 text-gray-900 font-medium"
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-600">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-semibold">Parol *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="123"
                  {...register("password")}
                  disabled={loading}
                  className="pr-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500 placeholder:text-gray-400 text-gray-900 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kirish...
                </>
              ) : (
                "Kirish"
              )}
            </button>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Hali ro'yxatdan o'tmaganmisiz?{" "}
                <Link
                  href="/register"
                  className="text-teal-600 hover:text-teal-700 font-semibold underline-offset-4 hover:underline"
                >
                  Ro'yxatdan o'tish
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
