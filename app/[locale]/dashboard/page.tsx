"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Stethoscope, User, LogOut, Loader2, Clock, Calendar, Users, FileText, Settings, Edit2, Utensils, Ban, Lightbulb, CheckCircle, XCircle, Edit, ClipboardList, UserPlus } from "lucide-react";
import { authService, appointmentService } from "@/lib/services";
import { doctorService } from "@/lib/services/doctor.service";
import { doctorResolver } from "@/lib/services/doctorResolver";
import { clearStoredToken } from "@/lib/api-client";
import { ProfileResponse, WorkingHour, AppointmentStatus } from "@/types";
import { LanguageSwitcher } from "@/components/language-switcher";
import { dashboardLogger } from "@/lib/utils/logger";

export default function DoctorDashboardPage() {
  const router = useRouter();
  const t = useTranslations();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [workingHours, setWorkingHours] = useState<WorkingHour[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<WorkingHour | null>(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    pendingAppointments: 0,
    totalDocuments: 0,
  });
  const [errorDetails, setErrorDetails] = useState<string>("");
  const [logs, setLogs] = useState<string[]>([]);
  const [doctorProfile, setDoctorProfile] = useState<{ fullName: string; specialization: string } | null>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-10), `${new Date().toLocaleTimeString()} ${msg}`]);
    console.log(`[Dashboard] ${msg}`);
  };


  useEffect(() => {
    // 1. Token Recovery from Cookie
    const localToken = localStorage.getItem("auth_token");
    if (!localToken) {
      const cookieToken = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      if (cookieToken) {
        console.log("[Dashboard] Restoring missing token from cookie");
        localStorage.setItem("auth_token", cookieToken);
      }
    }

    // 2. Fetch Data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Profil bilgilerini al
      let profileData;

      // Mock Data Check (Local Storage)
      const token = localStorage.getItem("auth_token");
      if (token && token.startsWith("mock-jwt-token-")) {
        const storedProfile = localStorage.getItem("mock_user_profile");
        if (storedProfile) {
          profileData = JSON.parse(storedProfile);
        }
      }

      // If no mock data, try fetching from API
      if (!profileData) {
        addLog("Fetching profile from API...");
        try {
          profileData = await authService.getProfile();
          addLog(`Profile received: ${JSON.stringify(profileData)?.substring(0, 50)}...`);
        } catch (fetchError: any) {
          addLog(`Fetch failed: ${fetchError?.message || fetchError}`);
          throw fetchError;
        }
      }

      setProfile(profileData);

      // Use DoctorResolver to get doctor ID
      let doctorId: number | null = null;
      try {
        doctorId = await doctorResolver.resolve();

        if (doctorId) {
          dashboardLogger.info("Init", "Doctor ID resolved:", doctorId);
          
          // Doktor profilini yukla
          try {
            const doctor = await doctorService.getDoctorById(doctorId);
            if (doctor) {
              setDoctorProfile({
                fullName: doctor.fullName || `${profileData?.firstName || ''} ${profileData?.lastName || ''}`.trim(),
                specialization: doctor.specialization || "Shifokor",
              });
            }
          } catch (docError) {
            dashboardLogger.warn("Init", "Could not load doctor profile:", docError);
          }
        } else {
          dashboardLogger.error("Init", "Could not resolve doctor ID - cannot load appointments");
          // 🔴 CRITICAL: Don't proceed without doctorId to prevent data leakage
          throw new Error("Doctor ID not found. Please complete your profile.");
        }
      } catch (e) {
        dashboardLogger.error("Init", "Error resolving doctor ID:", e);

        // If doctorId resolution fails, redirect to profile completion
        // This is safer than showing an error - user needs to complete profile
        dashboardLogger.info("Init", "Redirecting to profile completion due to missing doctorId");
        router.push("/dashboard/profile/complete");
        return;
      }

      // Randevu istatistiklerini al (only if doctorId is available)
      try {
        // SECURITY: Always filter by doctorId
        // Tüm randevuları al (hasta sayısı hesaplamak için de kullanılacak)
        const allAppointmentsPayload = {
          pageNumber: 1,
          pageSize: 1000, // Tüm randevuları al
          doctorId: doctorId, // MANDATORY - prevents data leak
        };

        dashboardLogger.debug("Appointments", "Fetching all appointments for doctorId:", doctorId);

        const allAppointments = await appointmentService.getAppointments(allAppointmentsPayload);
        const appointmentsData = allAppointments.data || [];

        // Pending randevu sayısı
        const pendingCount = appointmentsData.filter(
          apt => apt.status === AppointmentStatus.Pending
        ).length;

        // Unique hasta sayısı (randevulardan)
        const uniquePatientIds = new Set(
          appointmentsData.map(apt => apt.patientId)
        );

        dashboardLogger.info("Stats", `Pending: ${pendingCount}, Unique Patients: ${uniquePatientIds.size}`);

        setStats(prev => ({
          ...prev,
          pendingAppointments: pendingCount,
          totalPatients: uniquePatientIds.size,
        }));
      } catch (e) {
        dashboardLogger.warn("Appointments", "Failed to fetch appointments:", e);
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
      dashboardLogger.error("Dashboard", "Error loading dashboard:", error);
      let errorMessage = "Kutilmagan xatolik yuz berdi";

      if (typeof error === "string") {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else {
        try {
          errorMessage = JSON.stringify(error) || "Empty Error Object";
        } catch {
          errorMessage = "Unknown Non-String Error";
        }
      }

      dashboardLogger.debug("Dashboard", "Setting error details:", errorMessage);
      setErrorDetails(errorMessage);
      // DEV BYPASS: 401 hatası olsa bile login'e yönlendirme
      // if (error.status === 401) {
      //   clearStoredToken();
      //   router.push("/login");
      // }
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
      MONDAY: t('workingHours.days.monday'),
      TUESDAY: t('workingHours.days.tuesday'),
      WEDNESDAY: t('workingHours.days.wednesday'),
      THURSDAY: t('workingHours.days.thursday'),
      FRIDAY: t('workingHours.days.friday'),
      SATURDAY: t('workingHours.days.saturday'),
      SUNDAY: t('workingHours.days.sunday'),
    };
    return labels[day] || day;
  };

  const getTodayLabel = () => {
    const days = [
      t('workingHours.days.sunday'),
      t('workingHours.days.monday'),
      t('workingHours.days.tuesday'),
      t('workingHours.days.wednesday'),
      t('workingHours.days.thursday'),
      t('workingHours.days.friday'),
      t('workingHours.days.saturday')
    ];
    return days[new Date().getDay()];
  };

  const getFormattedDate = () => {
    const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
    const date = new Date();
    return `${getTodayLabel()}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-base text-slate-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // Error State for connectivity issues
  if (!profile && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC] p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-lg border border-red-100 text-center">
          <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Bog'lanib bo'lmadi</h2>
          <div className="text-slate-500 mb-6">
            Server bilan aloqa yo'q. Internetingizni tekshiring yoki keyinroq urinib ko'ring.
            <br />
            <div className="text-xs text-red-500 mt-2 block font-mono bg-red-50 p-2 rounded">
              Error: {errorDetails}
            </div>
            <div className="text-xs text-slate-400 mt-1 block font-mono">
              Token Status: {localStorage.getItem("auth_token") ? "Present" : "Missing"}
            </div>
            <div className="text-[10px] text-slate-300 mt-1 font-mono break-all max-h-20 overflow-auto">
              Storage: {typeof window !== 'undefined' ? JSON.stringify(window.localStorage) : 'N/A'}
            </div>
            <div className="text-[10px] text-slate-600 mt-4 font-mono bg-slate-100 p-2 rounded max-h-40 overflow-auto text-left">
              <strong>Debug Logs:</strong>
              {logs.map((log, i) => <div key={i}>{log}</div>)}
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Qayta yuklash
            </Button>
            <Button onClick={() => {
              authService.logout();
              window.location.href = '/login';
            }} variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
              Chiqish
            </Button>
          </div>
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
                  {doctorProfile?.fullName || `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || t('dashboard.title')}
                </h1>
                <p className="text-base text-slate-500">
                  {doctorProfile?.specialization || "Shifokor"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSwitcher variant="compact" />
              <Link href="/dashboard/profile">
                <Button variant="outline" size="default" className="hover:border-teal-500 hover:bg-teal-50">
                  <User className="h-4 w-4 mr-2" />
                  {t('profile.title')}
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="default"
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('common.logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Patients */}
            <Card className="border-slate-200 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    {t('patients.title')}
                  </CardTitle>
                  <div className="h-10 w-10 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Users className="h-5 w-5 text-teal-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-slate-800 mb-2">{stats.totalPatients}</div>
                <p className="text-sm text-slate-500">
                  {stats.totalPatients === 0 ? t('patients.noPatients') : t('patients.title')}
                </p>
              </CardContent>
            </Card>

            {/* Appointments */}
            <Link href="/dashboard/appointments">
              <Card className="border-teal-200 hover:border-teal-300 cursor-pointer bg-gradient-to-br from-white to-teal-50/30">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                      {t('appointments.title')}
                    </CardTitle>
                    <div className="h-10 w-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-slate-800 mb-2">{stats.pendingAppointments}</div>
                  <p className="text-sm text-teal-600 font-medium">{t('common.view')} →</p>
                </CardContent>
              </Card>
            </Link>

            {/* Documents */}
            <Card className="border-slate-200 bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    {t('reports.title')}
                  </CardTitle>
                  <div className="h-10 w-10 bg-teal-100 rounded-xl flex items-center justify-center">
                    <FileText className="h-5 w-5 text-teal-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-slate-800 mb-2">{stats.totalDocuments}</div>
                <p className="text-sm text-slate-500">{t('appointments.status.pending')}</p>
              </CardContent>
            </Card>
          </div>

          {/* Today's Working Hours */}
          <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-800">{t('workingHours.title')}</CardTitle>
                  <CardDescription className="text-base text-slate-500">{getFormattedDate()}</CardDescription>
                </div>
              </div>
              <Link href="/dashboard/working-hours">
                <Button variant="outline" size="default" className="gap-2 border-teal-300 hover:border-teal-500 hover:bg-teal-50">
                  <Edit2 className="h-4 w-4" />
                  {t('common.edit')}
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {todaySchedule ? (
                <div className="space-y-4">
                  {todaySchedule.isActive ? (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-teal-100 rounded-xl flex items-center justify-center">
                          <Clock className="h-6 w-6 text-teal-600" />
                        </div>
                        <span className="text-2xl font-bold text-teal-700">
                          {todaySchedule.startTime} - {todaySchedule.endTime}
                        </span>
                        <span className="ml-2 px-3 py-1.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold rounded-lg shadow-sm">
                          {t('workingHours.workingDay')}
                        </span>
                      </div>
                      {todaySchedule.breakStart && todaySchedule.breakEnd && (
                        <div className="flex items-center gap-3 text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                          <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Utensils className="h-5 w-5 text-orange-600" />
                          </div>
                          <span className="text-base font-medium">{t('workingHours.breakTime')}: {todaySchedule.breakStart} - {todaySchedule.breakEnd}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-3 text-slate-500 py-2">
                      <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center">
                        <Ban className="h-6 w-6 text-slate-400" />
                      </div>
                      <span className="text-xl font-semibold">{t('workingHours.dayOff')}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-base text-slate-500 mb-4">{t('workingHours.schedule')}</p>
                  <Link href="/dashboard/working-hours">
                    <Button className="shadow-lg hover:shadow-xl transition-all text-base px-6 py-3">
                      <Settings className="h-5 w-5 mr-2" />
                      {t('common.edit')}
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Two Column Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Weekly Schedule Summary */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                  <Calendar className="h-6 w-6 text-teal-600" />
                  {t('workingHours.schedule')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {workingHours.length > 0 ? (
                  <div className="space-y-2">
                    {workingHours.map((wh) => (
                      <div
                        key={wh.dayOfWeek}
                        className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                      >
                        <span className="font-semibold text-base text-slate-700">{getDayLabel(wh.dayOfWeek)}</span>
                        <div className="flex items-center gap-2">
                          {wh.isActive ? (
                            <CheckCircle className="h-5 w-5 text-teal-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-slate-400" />
                          )}
                          <span className={`text-sm font-medium ${wh.isActive ? "text-slate-800" : "text-slate-400"}`}>
                            {wh.isActive ? `${wh.startTime} - ${wh.endTime}` : t('workingHours.dayOff')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-base text-slate-500 py-4">{t('workingHours.schedule')}</p>
                )}
                <Link href="/dashboard/working-hours">
                  <Button variant="outline" className="w-full mt-4 hover:border-teal-500 hover:bg-teal-50 text-base">
                    {t('common.view')} →
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                  <Settings className="h-6 w-6 text-teal-600" />
                  {t('dashboard.sidebar.settings')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/dashboard/profile/complete">
                    <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 hover:border-teal-300 hover:bg-teal-50 transition-all">
                      <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Edit className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-base text-slate-800">{t('profile.complete.title')}</div>
                        <div className="text-sm text-slate-500">{t('profile.personalInfo')}</div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/dashboard/working-hours">
                    <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 hover:border-teal-300 hover:bg-teal-50 transition-all">
                      <div className="h-10 w-10 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="h-5 w-5 text-violet-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-base text-slate-800">{t('workingHours.title')}</div>
                        <div className="text-sm text-slate-500">{t('workingHours.schedule')}</div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/dashboard/appointments">
                    <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 hover:border-teal-300 hover:bg-teal-50 transition-all">
                      <div className="h-10 w-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-5 w-5 text-teal-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-base text-slate-800">{t('appointments.title')}</div>
                        <div className="text-sm text-slate-500">{t('common.view')}</div>
                      </div>
                    </Button>
                  </Link>

                  <Link href="/dashboard/reports/create">
                    <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4 border-teal-300 hover:border-teal-500 bg-teal-50/50 hover:bg-teal-100 transition-all">
                      <div className="h-10 w-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/20">
                        <ClipboardList className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-base text-teal-700">{t('reports.newReport')}</div>
                        <div className="text-sm text-teal-600">{t('reports.create.title')}</div>
                      </div>
                    </Button>
                  </Link>

                  <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4" disabled>
                    <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <UserPlus className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-base text-slate-400">{t('patients.title')}</div>
                      <div className="text-sm text-slate-400">{t('common.loading')}</div>
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
