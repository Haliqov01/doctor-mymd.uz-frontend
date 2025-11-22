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

interface DoctorProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  specialization?: string;
  licenseNumber?: string;
  licenseVerified: boolean;
}

export default function DoctorProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<DoctorProfile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/auth/session");
      const result = await response.json();

      if (!response.ok || !result.data) {
        router.push("/login");
        return;
      }

      if (result.data.user.role !== "DOCTOR") {
        router.push("/");
        return;
      }

      const profileData = {
        firstName: result.data.profile?.firstName || "",
        lastName: result.data.profile?.lastName || "",
        email: result.data.user.email,
        phoneNumber: result.data.user.phoneNumber || "",
        specialization: result.data.profile?.specialization,
        licenseNumber: result.data.profile?.licenseNumber,
        licenseVerified: result.data.profile?.licenseVerified || false,
      };
      setProfile(profileData);
      setEditedProfile(profileData);
    } catch (error) {
      console.error("Profil yuklashda xato:", error);
      router.push("/login");
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
      // TODO: API call to update profile
      // For now, just simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProfile(editedProfile);
      setIsEditing(false);
      
      // Show success message (you can add a toast here)
      console.log("Profil yangilandi!");
    } catch (error) {
      console.error("Profil yangilashda xato:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof DoctorProfile, value: string) => {
    if (editedProfile) {
      setEditedProfile({ ...editedProfile, [field]: value });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Stethoscope className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-green-600">
                  Shifokor Profili
                </h1>
                <p className="text-sm text-gray-600">
                  Shaxsiy ma'lumotlaringizni ko'rish va tahrirlash
                </p>
              </div>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Orqaga
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Profil Ma'lumotlari</CardTitle>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEdit}
                    className="text-green-600 border-green-300 hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Tahrirlash
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Bekor qilish
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
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
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Label htmlFor="phoneNumber">Telefon raqami</Label>
                        <Input
                          id="phoneNumber"
                          value={editedProfile.phoneNumber}
                          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                          placeholder="+998 XX XXX XX XX"
                        />
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="space-y-3">
                      <div className="flex items-center py-2 border-b">
                        <span className="font-semibold text-white w-32">Ism:</span>
                        <span className="text-white">{profile.firstName || "—"}</span>
                      </div>
                      <div className="flex items-center py-2 border-b">
                        <span className="font-semibold text-white w-32">Familiya:</span>
                        <span className="text-white">{profile.lastName || "—"}</span>
                      </div>
                      <div className="flex items-center py-2 border-b">
                        <span className="font-semibold text-white w-32">Email:</span>
                        <span className="text-white">{profile.email || "—"}</span>
                      </div>
                      <div className="flex items-center py-2 border-b">
                        <span className="font-semibold text-white w-32">Telefon:</span>
                        <span className="text-white">{profile.phoneNumber || "—"}</span>
                      </div>
                      {profile.specialization && (
                        <div className="flex items-center py-2 border-b">
                          <span className="font-semibold text-white w-32">Mutaxassislik:</span>
                          <span className="text-white">{profile.specialization}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Placeholder Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Profilni to'ldirish va tasdiqlash</CardTitle>
              <CardDescription>
              Foydalanuvchi ro'yxatdan o'tish ma'lumotlarini to'ldirgandan so'ng, profil ma'lumotlari administrator tomonidan tekshiriladi va tasdiqlanadi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => router.push("/dashboard/profile/complete")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Profil ma'lumotlarini to'ldirish
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}