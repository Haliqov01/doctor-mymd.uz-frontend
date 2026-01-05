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
import { Stethoscope, User, LogOut, Loader2, Clock, Calendar, Users, FileText, Settings, Edit2, Utensils, Ban, Lightbulb, CheckCircle, XCircle, Edit, ClipboardList, UserPlus } from "lucide-react";
import { authService, appointmentService, patientService } from "@/lib/services";
import { clearStoredToken } from "@/lib/api-client";
import { UserProfileViewModel, WorkingHour, AppointmentStatus } from "@/types";

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfileViewModel | null>(null);
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<WorkingHour | null>(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    pendingAppointments: 0,
    totalDocuments: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Profil bilgilerini al
      const profileData = await authService.getProfile();

      if (profileData.role !== "Doctor") {
        router.push("/");
        return;
      }

      setProfile(profileData);

      // Randevu istatistiklerini al
      try {
        const appointments = await appointmentService.getAppointments({
          pageNumber: 1,
          pageSize: 100,
          status: AppointmentStatus.Pending,
        });
        setStats(prev => ({
          ...prev,
          pendingAppointments: appointments.totalCount || 0,
        }));
      } catch (e) {
        console.log("Randevu verileri alınamadı:", e);
      }

      // Hasta sayısını al
      try {
        const patients = await patientService.getPatients({
          pageNumber: 1,
          pageSize: 1,
        });
        setStats(prev => ({
          ...prev,
          totalPatients: patients.totalCount || 0,
        }));
      } catch (e) {
        console.log("Hasta verileri alınamadı:", e);
      }

      // Çalışma saatlerini al (şimdilik mock - backend'de henüz yok)
      const mockWorkingHours: WorkingHour[] = [
        { dayOfWeek: "MONDAY", startTime: "09:00", endTime: "18:00", breakStart: "12:00", breakEnd: "13:00", isActive: true },
        { dayOfWeek: "TUESDAY", startTime: "09:00", endTime: "18:00", breakStart: "12:00", breakEnd: "13:00", isActive: true },
        { dayOfWeek: "WEDNESDAY", startTime: "09:00", endTime: "18:00", breakStart: "12:00", breakEnd: "13:00", isActive: true },
        { dayOfWeek: "THURSDAY", startTime: "09:00", endTime: "18:00", breakStart: "12:00", breakEnd: "13:00", isActive: true },
        { dayOfWeek: "FRIDAY", startTime: "09:00", endTime: "18:00", breakStart: "12:00", breakEnd: "13:00", isActive: true },
        { dayOfWeek: "SATURDAY", startTime: "09:00", endTime: "14:00", breakStart: null, breakEnd: null, isActive: false },
        { dayOfWeek: "SUNDAY", startTime: "00:00", endTime: "00:00", breakStart: null, breakEnd: null, isActive: false },
      ];
      setWorkingHours(mockWorkingHours);

      // Bugünün çalışma saatini bul
      const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
      const today = days[new Date().getDay()];
      const todayHours = mockWorkingHours.find((wh) => wh.dayOfWeek === today);
      setTodaySchedule(todayHours || null);

    } catch (error: any) {
      console.error("Dashboard verileri yüklenirken hata:", error);
      if (error.status === 401) {
        clearStoredToken();
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    router.push("/login");
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
                  Shifokor Paneli
                </h1>
                <p className="text-base text-neutral-600">
                  {profile?.firstName} {profile?.lastName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard/profile">
                <Button variant="outline" size="default" className="border-2 hover:border-green-500 hover:bg-green-50">
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="default"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Patients */}
            <Card className="border-neutral-200 hover:shadow-soft-lg transition-all duration-200 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-neutral-600 uppercase tracking-wide">
                    Jami Bemorlar
                  </CardTitle>
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-neutral-900 mb-2">{stats.totalPatients}</div>
                <p className="text-sm text-neutral-600">
                  {stats.totalPatients === 0 ? "Hozircha bemorlar yo'q" : "Ro'yxatdagi bemorlar"}
                </p>
              </CardContent>
            </Card>

            {/* Appointments */}
            <Link href="/dashboard/appointments">
              <Card className="border-green-200 hover:shadow-soft-lg hover:border-green-300 transition-all duration-200 cursor-pointer bg-gradient-to-br from-white to-green-50/30">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-neutral-600 uppercase tracking-wide">
                      Kutilayotgan Randevular
                    </CardTitle>
                    <div className="h-10 w-10 bg-green-600 rounded-lg flex items-center justify-center shadow-sm">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-neutral-900 mb-2">{stats.pendingAppointments}</div>
                  <p className="text-sm text-green-700 font-medium">Ko'rish uchun bosing →</p>
                </CardContent>
              </Card>
            </Link>

            {/* Documents */}
            <Card className="border-neutral-200 hover:shadow-soft-lg transition-all duration-200 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-neutral-600 uppercase tracking-wide">
                    Hujjatlar
                  </CardTitle>
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-neutral-900 mb-2">{stats.totalDocuments}</div>
                <p className="text-sm text-neutral-600">Ko'rib chiqish kutilmoqda</p>
              </CardContent>
            </Card>
          </div>

          {/* Today's Working Hours */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-green-600 flex items-center justify-center shadow-soft">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-neutral-900">Bugungi Ish Vaqtim</CardTitle>
                  <CardDescription className="text-base text-neutral-600">{getFormattedDate()}</CardDescription>
                </div>
              </div>
              <Link href="/dashboard/working-hours">
                <Button variant="outline" size="default" className="gap-2 border-2 border-green-300 hover:border-green-500 hover:bg-green-50">
                  <Edit2 className="h-4 w-4" />
                  Tahrirlash
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {todaySchedule ? (
                <div className="space-y-4">
                  {todaySchedule.isActive ? (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Clock className="h-6 w-6 text-green-600" />
                        </div>
                        <span className="text-2xl font-bold text-green-700">
                          {todaySchedule.startTime} - {todaySchedule.endTime}
                        </span>
                        <span className="ml-2 px-3 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-lg shadow-sm">
                          Aktiv
                        </span>
                      </div>
                      {todaySchedule.breakStart && todaySchedule.breakEnd && (
                        <div className="flex items-center gap-3 text-neutral-700 bg-white p-3 rounded-lg border border-neutral-200">
                          <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Utensils className="h-5 w-5 text-orange-600" />
                          </div>
                          <span className="text-base font-medium">Tushlik: {todaySchedule.breakStart} - {todaySchedule.breakEnd}</span>
                        </div>
                      )}
                      <div className="mt-4 pt-4 border-t-2 border-green-200">
                        <div className="text-base text-neutral-600 flex items-center gap-2">
                          <div className="h-6 w-6 bg-blue-100 rounded-md flex items-center justify-center">
                            <Lightbulb className="h-4 w-4 text-blue-600" />
                          </div>
                          Bemorlar bugun randevu olishlari mumkin
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-3 text-neutral-500 py-2">
                      <div className="h-10 w-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                        <Ban className="h-6 w-6 text-neutral-400" />
                      </div>
                      <span className="text-xl font-semibold">Bugun dam olish kuni</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-base text-neutral-500 mb-4">Ish vaqtlari hali belgilanmagan</p>
                  <Link href="/dashboard/working-hours">
                    <Button className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all text-base px-6 py-3">
                      <Settings className="h-5 w-5 mr-2" />
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
            <Card className="border-neutral-200 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-neutral-900">
                  <Calendar className="h-6 w-6 text-green-600" />
                  Haftalik Jadval
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workingHours.length > 0 ? (
                  <div className="space-y-2">
                    {workingHours.map((wh) => (
                      <div
                        key={wh.dayOfWeek}
                        className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-0"
                      >
                        <span className="font-semibold text-base text-neutral-700">{getDayLabel(wh.dayOfWeek)}</span>
                        <div className="flex items-center gap-2">
                          {wh.isActive ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-neutral-400" />
                          )}
                          <span className={`text-sm font-medium ${wh.isActive ? "text-neutral-900" : "text-neutral-400"}`}>
                            {wh.isActive ? `${wh.startTime} - ${wh.endTime}` : "Yopiq"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-base text-neutral-500 py-4">Jadval hali belgilanmagan</p>
                )}
                <Link href="/dashboard/working-hours">
                  <Button variant="outline" className="w-full mt-4 border-2 hover:border-green-500 hover:bg-green-50 text-base">
                    Batafsil ko'rish va tahrirlash →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-neutral-200 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-neutral-900">
                  <Settings className="h-6 w-6 text-green-600" />
                  Tezkor Harakatlar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/dashboard/profile/complete">
                    <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 border-2 hover:border-green-300 hover:bg-green-50 transition-all">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Edit className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-base text-neutral-900">Profilni to'ldirish</div>
                        <div className="text-sm text-neutral-600">Ma'lumotlaringizni yangilang</div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/dashboard/working-hours">
                    <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 border-2 hover:border-green-300 hover:bg-green-50 transition-all">
                      <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-base text-neutral-900">Ish vaqtlarini sozlash</div>
                        <div className="text-sm text-neutral-600">Haftalik jadvalingizni belgilang</div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/dashboard/appointments">
                    <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 border-2 hover:border-green-300 hover:bg-green-50 transition-all">
                      <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-base text-neutral-900">Randevularni ko'rish</div>
                        <div className="text-sm text-neutral-600">Randevu taleplarini boshqarish</div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/dashboard/reports/create">
                    <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 border-2 border-green-300 hover:border-green-500 bg-green-50/50 hover:bg-green-100 transition-all">
                      <div className="h-10 w-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <ClipboardList className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-base text-green-800">Ko'z ko'rigi natijalari</div>
                        <div className="text-sm text-green-700">Yangi hisobot yaratish</div>
                      </div>
                    </Button>
                  </Link>

                  <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 border-2" disabled>
                    <div className="h-10 w-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <UserPlus className="h-5 w-5 text-neutral-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-base text-neutral-400">Bemorlarim</div>
                      <div className="text-sm text-neutral-400">Tez kunda</div>
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
