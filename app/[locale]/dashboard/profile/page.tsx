"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Stethoscope, FileText, Edit2, Save, X } from "lucide-react";
import { authService } from "@/lib/services";
import { clearStoredToken } from "@/lib/api-client";
import { UserProfileViewModel } from "@/types";

export default function DoctorProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfileViewModel | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfileViewModel | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const profileData = await authService.getProfile();

      if (profileData.role !== "Doctor") {
        router.push("/");
        return;
      }

      setProfile(profileData);
      setEditedProfile(profileData);
    } catch (error: any) {
      console.error("Profil yuklashda xato:", error);
      if (error.status === 401) {
        clearStoredToken();
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleSave = async () => {
    if (!editedProfile) return;

    setSaving(true);
    try {
      const updatedProfile = await authService.updateProfile({
        userId: editedProfile.id,  // Required field
        firstName: editedProfile.firstName,
        lastName: editedProfile.lastName,
        email: editedProfile.email,
        phone: editedProfile.phone,
        address: editedProfile.address,
      });

      setProfile(updatedProfile);
      setIsEditing(false);
      alert("Profil muvaffaqiyatli yangilandi!");
    } catch (error: any) {
      console.error("Profil yangilashda xato:", error);
      alert(error.message || "Profil yangilashda xato yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserProfileViewModel, value: string) => {
    if (editedProfile) {
      setEditedProfile({ ...editedProfile, [field]: value });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-base text-slate-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/[0.02] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/[0.02] rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Shifokor Profili
                </h1>
                <p className="text-base text-slate-500">
                  Shaxsiy ma'lumotlaringizni ko'rish va tahrirlash
                </p>
              </div>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="hover:border-teal-500 hover:bg-teal-50 text-base">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <Card className="border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-slate-800">Profil Ma'lumotlari</CardTitle>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="default"
                    onClick={handleEdit}
                    className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:border-teal-300 transition-all font-semibold"
                  >
                    <Edit2 className="h-5 w-5 mr-2" />
                    Tahrirlash
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="default"
                      onClick={handleCancel}
                      disabled={saving}
                      className="font-semibold"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Bekor qilish
                    </Button>
                    <Button
                      size="default"
                      onClick={handleSave}
                      disabled={saving}
                      className="font-semibold"
                    >
                      {saving ? (
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-5 w-5 mr-2" />
                      )}
                      Saqlash
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {profile && editedProfile && (
                <div className="space-y-4">
                  {isEditing ? (
                    // Edit Mode
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Ism</Label>
                          <Input
                            id="firstName"
                            value={editedProfile.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            placeholder="Ismingizni kiriting"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Familiya</Label>
                          <Input
                            id="lastName"
                            value={editedProfile.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            placeholder="Familiyangizni kiriting"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="Email manzilingizni kiriting"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefon raqami</Label>
                        <Input
                          id="phone"
                          value={editedProfile.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+998 XX XXX XX XX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Manzil</Label>
                        <Input
                          id="address"
                          value={editedProfile.address || ""}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="Manzilingizni kiriting"
                        />
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="space-y-1">
                      <div className="flex items-center py-4 border-b border-slate-200">
                        <span className="font-semibold text-slate-600 text-base w-40">Ism:</span>
                        <span className="text-slate-800 text-base font-medium">{profile.firstName || "—"}</span>
                      </div>
                      <div className="flex items-center py-4 border-b border-slate-200">
                        <span className="font-semibold text-slate-600 text-base w-40">Familiya:</span>
                        <span className="text-slate-800 text-base font-medium">{profile.lastName || "—"}</span>
                      </div>
                      <div className="flex items-center py-4 border-b border-slate-200">
                        <span className="font-semibold text-slate-600 text-base w-40">Email:</span>
                        <span className="text-slate-800 text-base font-medium">{profile.email || "—"}</span>
                      </div>
                      <div className="flex items-center py-4 border-b border-slate-200">
                        <span className="font-semibold text-slate-600 text-base w-40">Telefon:</span>
                        <span className="text-slate-800 text-base font-medium">{profile.phone || "—"}</span>
                      </div>
                      {profile.address && (
                        <div className="flex items-center py-4 border-b border-slate-200">
                          <span className="font-semibold text-slate-600 text-base w-40">Manzil:</span>
                          <span className="text-slate-800 text-base font-medium">{profile.address}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Placeholder Card */}
          <Card className="mt-6 border-teal-200 bg-gradient-to-br from-teal-50 to-white">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-800">Profilni to'ldirish va tasdiqlash</CardTitle>
              <CardDescription className="text-base text-slate-500">
                Foydalanuvchi ro'yxatdan o'tish ma'lumotlarini to'ldirgandan so'ng, profil ma'lumotlari administrator tomonidan tekshiriladi va tasdiqlanadi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full text-base font-semibold"
                onClick={() => router.push("/dashboard/profile/complete")}
              >
                <FileText className="h-5 w-5 mr-2" />
                Profil ma'lumotlarini to'ldirish
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
