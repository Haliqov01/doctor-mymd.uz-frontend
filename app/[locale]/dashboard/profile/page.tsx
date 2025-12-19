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
import { ProfileResponse } from "@/types";

export default function DoctorProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<ProfileResponse | null>(null);

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

  const handleInputChange = (field: keyof ProfileResponse, value: string) => {
    if (editedProfile) {
      setEditedProfile({ ...editedProfile, [field]: value });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-base text-neutral-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 shadow-soft sticky top-0 z-50">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-soft">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  Shifokor Profili
                </h1>
                <p className="text-base text-neutral-600">
                  Shaxsiy ma'lumotlaringizni ko'rish va tahrirlash
                </p>
              </div>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="border-2 hover:border-green-500 hover:bg-green-50 text-base">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <Card className="border-2 border-neutral-200 shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-neutral-900">Profil Ma'lumotlari</CardTitle>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="default"
                    onClick={handleEdit}
                    className="border-2 border-green-300 text-green-700 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all font-semibold"
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
                      className="border-2 font-semibold"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Bekor qilish
                    </Button>
                    <Button
                      size="default"
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl font-semibold"
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
                          <Label htmlFor="firstName" className="text-base font-semibold text-neutral-700">Ism</Label>
                          <Input
                            id="firstName"
                            value={editedProfile.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            placeholder="Ismingizni kiriting"
                            className="h-12 text-base border-2 border-neutral-200 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-base font-semibold text-neutral-700">Familiya</Label>
                          <Input
                            id="lastName"
                            value={editedProfile.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            placeholder="Familiyangizni kiriting"
                            className="h-12 text-base border-2 border-neutral-200 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-base font-semibold text-neutral-700">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="Email manzilingizni kiriting"
                          className="h-12 text-base border-2 border-neutral-200 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-base font-semibold text-neutral-700">Telefon raqami</Label>
                        <Input
                          id="phone"
                          value={editedProfile.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+998 XX XXX XX XX"
                          className="h-12 text-base border-2 border-neutral-200 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-base font-semibold text-neutral-700">Manzil</Label>
                        <Input
                          id="address"
                          value={editedProfile.address || ""}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          placeholder="Manzilingizni kiriting"
                          className="h-12 text-base border-2 border-neutral-200 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                        />
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="space-y-1">
                      <div className="flex items-center py-4 border-b border-neutral-200">
                        <span className="font-semibold text-neutral-700 text-base w-40">Ism:</span>
                        <span className="text-neutral-900 text-base font-medium">{profile.firstName || "—"}</span>
                      </div>
                      <div className="flex items-center py-4 border-b border-neutral-200">
                        <span className="font-semibold text-neutral-700 text-base w-40">Familiya:</span>
                        <span className="text-neutral-900 text-base font-medium">{profile.lastName || "—"}</span>
                      </div>
                      <div className="flex items-center py-4 border-b border-neutral-200">
                        <span className="font-semibold text-neutral-700 text-base w-40">Email:</span>
                        <span className="text-neutral-900 text-base font-medium">{profile.email || "—"}</span>
                      </div>
                      <div className="flex items-center py-4 border-b border-neutral-200">
                        <span className="font-semibold text-neutral-700 text-base w-40">Telefon:</span>
                        <span className="text-neutral-900 text-base font-medium">{profile.phone || "—"}</span>
                      </div>
                      {profile.address && (
                        <div className="flex items-center py-4 border-b border-neutral-200">
                          <span className="font-semibold text-neutral-700 text-base w-40">Manzil:</span>
                          <span className="text-neutral-900 text-base font-medium">{profile.address}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Placeholder Card */}
          <Card className="mt-6 border-2 border-green-200 bg-gradient-to-br from-green-50 to-white shadow-soft">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-neutral-900">Profilni to'ldirish va tasdiqlash</CardTitle>
              <CardDescription className="text-base text-neutral-600">
                Foydalanuvchi ro'yxatdan o'tish ma'lumotlarini to'ldirgandan so'ng, profil ma'lumotlari administrator tomonidan tekshiriladi va tasdiqlanadi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
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
