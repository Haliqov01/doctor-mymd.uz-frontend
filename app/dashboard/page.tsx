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
import { Stethoscope, User, LogOut, Loader2, Clock, Calendar, Users, FileText, Settings, Edit2 } from "lucide-react";

interface DoctorProfile {
  firstName: string;
  lastName: string;
  specialization?: string;
}

interface WorkingHour {
  dayOfWeek: string;
  isActive: boolean;
  startTime: string;
  endTime: string;
  breakStart: string | null;
  breakEnd: string | null;
}

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<WorkingHour | null>(null);

  useEffect(() => {
    fetchProfile();
    // Only fetch working hours if API is ready
    fetchWorkingHours().catch(err => {
      console.log("Working hours API not ready yet:", err);
    });
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/auth/session");
      
      if (!response.ok) {
        console.error("Session API error:", response.status);
        router.push("/login");
        return;
      }

      const result = await response.json();

      if (!result.data) {
        router.push("/login");
        return;
      }

      if (result.data.user.role !== "DOCTOR") {
        router.push("/");
        return;
      }

      setProfile({
        firstName: result.data.user.profile?.firstName || "",
        lastName: result.data.user.profile?.lastName || "",
        specialization: result.data.user.profile?.specialization,
      });
    } catch (error) {
      console.error("Profil yuklashda xato:", error);
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkingHours = async () => {
    try {
      const response = await fetch("/api/doctor/working-hours");
      const result = await response.json();

      if (result.success && result.data) {
        setWorkingHours(result.data);
        
        // Get today's schedule
        const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        const today = days[new Date().getDay()];
        const todayHours = result.data.find((wh: WorkingHour) => wh.dayOfWeek === today);
        setTodaySchedule(todayHours || null);
      }
    } catch (error) {
      console.error("Error fetching working hours:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Chiqish xatosi:", error);
    }
  };

  const getDayLabel = (day: string) => {
    const labels: { [key: string]: string } = {
      MONDAY: "Dushanba",
      TUESDAY: "Seshanba",
      WEDNESDAY: "Chorshanba",
      THURSDAY: "Payshanba",
      FRIDAY: "Juma",
      SATURDAY: "Shanba",
      SUNDAY: "Yakshanba",
    };
    return labels[day] || day;
  };

  const getTodayLabel = () => {
    const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
    return days[new Date().getDay()];
  };

  const getFormattedDate = () => {
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
    const date = new Date();
    return `${getTodayLabel()}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
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
                <h1 className="text-2xl font-bold text-gray-900">
                  Shifokor Paneli
                </h1>
                <p className="text-sm text-gray-600">
                  {profile?.firstName} {profile?.lastName}
                  {profile?.specialization && ` • ${profile.specialization}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard/profile">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Chiqish
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Patients */}
            <Card className="border-blue-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Jami Bemorlar
                  </CardTitle>
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">0</div>
                <p className="text-xs text-gray-500 mt-1">Hozircha bemorlar yo'q</p>
              </CardContent>
            </Card>

            {/* Appointments */}
            <Link href="/dashboard/appointments">
              <Card className="border-purple-200 hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Randevular
                    </CardTitle>
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">0</div>
                  <p className="text-xs text-gray-500 mt-1">Randevu taleplarini ko'rish</p>
                </CardContent>
              </Card>
            </Link>

            {/* Documents */}
            <Card className="border-orange-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Hujjatlar
                  </CardTitle>
                  <FileText className="h-5 w-5 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">0</div>
                <p className="text-xs text-gray-500 mt-1">Ko'rib chiqish kutilmoqda</p>
              </CardContent>
            </Card>
          </div>

          {/* Today's Working Hours */}
          <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <CardTitle>Bugungi Ish Vaqtim</CardTitle>
                  <CardDescription>{getFormattedDate()}</CardDescription>
                </div>
              </div>
              <Link href="/dashboard/working-hours">
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit2 className="h-4 w-4" />
                  Tahrirlash
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {todaySchedule ? (
                <div className="space-y-3">
                  {todaySchedule.isActive ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">⏰</span>
                        <span className="text-lg font-semibold">
                          {todaySchedule.startTime} - {todaySchedule.endTime}
                        </span>
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          Aktiv
                        </span>
                      </div>
                      {todaySchedule.breakStart && todaySchedule.breakEnd && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="text-xl">🍽️</span>
                          <span>Tushlik: {todaySchedule.breakStart} - {todaySchedule.breakEnd}</span>
                        </div>
                      )}
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <p className="text-sm text-gray-600">
                          💡 Bemorlar bugun randevu olishlari mumkin
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-500">
                      <span className="text-2xl">🚫</span>
                      <span className="text-lg">Bugun dam olish kuni</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-3">Ish vaqtlari hali belgilanmagan</p>
                  <Link href="/dashboard/working-hours">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Settings className="h-4 w-4 mr-2" />
                      Ish vaqtlarini sozlash
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Two Column Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Weekly Schedule Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Haftalik Jadval
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workingHours.length > 0 ? (
                  <div className="space-y-2">
                    {workingHours.map((wh) => (
                      <div
                        key={wh.dayOfWeek}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <span className="font-medium text-sm">{getDayLabel(wh.dayOfWeek)}</span>
                        <div className="flex items-center gap-2">
                          <span className={wh.isActive ? "text-green-600" : "text-gray-400"}>
                            {wh.isActive ? "✅" : "❌"}
                          </span>
                          <span className={`text-sm ${wh.isActive ? "" : "text-gray-400"}`}>
                            {wh.isActive ? `${wh.startTime} - ${wh.endTime}` : "Yopiq"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Jadval hali belgilanmagan</p>
                )}
                <Link href="/dashboard/working-hours">
                  <Button variant="outline" className="w-full mt-4">
                    Batafsil ko'rish va tahrirlash →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-green-600" />
                  Tezkor Harakatlar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/dashboard/profile/complete">
                    <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                      <span className="text-xl">✏️</span>
                      <div className="text-left">
                        <div className="font-semibold">Profilni to'ldirish</div>
                        <div className="text-xs text-gray-500">Ma'lumotlaringizni yangilang</div>
                      </div>
                    </Button>
                  </Link>
                  
                  <Link href="/dashboard/working-hours">
                    <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                      <span className="text-xl">🕐</span>
                      <div className="text-left">
                        <div className="font-semibold">Ish vaqtlarini sozlash</div>
                        <div className="text-xs text-gray-500">Haftalik jadvalingizni belgilang</div>
                      </div>
                    </Button>
                  </Link>
                  
                  <Link href="/dashboard/appointments">
                    <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3">
                      <span className="text-xl">📅</span>
                      <div className="text-left">
                        <div className="font-semibold">Randevularni ko'rish</div>
                        <div className="text-xs text-gray-500">Randevu taleplarini boshqarish</div>
                      </div>
                    </Button>
                  </Link>
                  
                  <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3" disabled>
                    <span className="text-xl">👥</span>
                    <div className="text-left">
                      <div className="font-semibold">Bemorlarim</div>
                      <div className="text-xs text-gray-500">Tez kunda</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
