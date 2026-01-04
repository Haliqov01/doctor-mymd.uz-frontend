"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Stethoscope, Loader2, ChevronRight, ChevronLeft, User, GraduationCap, Briefcase, Target, Globe, CheckCircle } from "lucide-react";
import { useProfileForm } from "./hooks/use-profile-form";
import { PersonalInfoTab } from "./components/PersonalInfoTab";
import { EducationTab } from "./components/EducationTab";
import { ExperienceTab } from "./components/ExperienceTab";
import { SpecializationTab } from "./components/SpecializationTab";
import { SocialMediaTab } from "./components/SocialMediaTab";
import { ReviewTab } from "./components/ReviewTab";

const tabs = [
  { value: "personal", label: "Shaxsiy", icon: User, iconColor: "text-blue-600", bgColor: "bg-blue-100", fullLabel: "Shaxsiy ma'lumotlar" },
  { value: "education", label: "Ta'lim", icon: GraduationCap, iconColor: "text-violet-600", bgColor: "bg-violet-100", fullLabel: "Ta'lim ma'lumotlari" },
  { value: "experience", label: "Tajriba", icon: Briefcase, iconColor: "text-orange-600", bgColor: "bg-orange-100", fullLabel: "Kasbiy tajriba" },
  { value: "specialization", label: "Ixtisoslik", icon: Target, iconColor: "text-rose-600", bgColor: "bg-rose-100", fullLabel: "Ixtisoslik" },
  { value: "social", label: "Ijtimoiy", icon: Globe, iconColor: "text-cyan-600", bgColor: "bg-cyan-100", fullLabel: "Ijtimoiy tarmoqlar" },
  { value: "review", label: "Tasdiqlash", icon: CheckCircle, iconColor: "text-teal-600", bgColor: "bg-teal-100", fullLabel: "Tasdiqlash" },
];

export default function CompleteProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const {
    formData,
    bachelorDiploma,
    setBachelorDiploma,
    masterDiploma,
    setMasterDiploma,
    academicDegreeCertificate,
    setAcademicDegreeCertificate,
    categoryCertificate,
    setCategoryCertificate,
    internationalTraining,
    handleInputChange,
    handleTextareaChange,
    handleSelectChange,
    handleCheckboxChange,
    handleTrainingChange,
    addTraining,
    removeTraining,
  } = useProfileForm();

  const currentTabIndex = tabs.findIndex((tab) => tab.value === activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabs.length - 1;

  const handleNext = () => {
    if (!isLastTab) {
      setActiveTab(tabs[currentTabIndex + 1].value);
    }
  };

  const handlePrevious = () => {
    if (!isFirstTab) {
      setActiveTab(tabs[currentTabIndex - 1].value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get user profile
      const { authService } = await import("@/lib/services");
      const profile = await authService.getProfile();

      if (!profile || !profile.id) {
        throw new Error("Kullanıcı bilgileri alınamadı");
      }

      console.log("[Profile Complete] User ID:", profile.id);

      // Check if doctor profile already exists
      const { doctorService } = await import("@/lib/services/doctor.service");
      const { doctorResolver } = await import("@/lib/services/doctorResolver");

      let existingDoctorId: number | null = null;

      try {
        // Try to resolve existing doctor
        existingDoctorId = await doctorResolver.resolve();
        if (existingDoctorId) {
          console.log("[Profile Complete] Found existing doctor ID:", existingDoctorId);
        }
      } catch (e) {
        console.log("[Profile Complete] No existing doctor found, will create new");
      }

      // Prepare doctor payload - SWAGGER UYUMLU
      const doctorPayload: any = {
        userId: profile.id,                                             // ZORUNLU (int64)
        fullName: `${formData.firstName} ${formData.lastName}`.trim() || "Doktor", // ZORUNLU
        specialization: formData.specialization1?.trim() || "Genel",   // ZORUNLU
        experienceYears: parseInt(formData.yearsOfExperience) || 0,    // NUMBER (0-80)
        workplace: formData.clinic1Name?.trim() || undefined,          // Optional
        biography: formData.keywords?.trim() || undefined,             // Optional
      };

      // Include ID if updating existing doctor - DoctorAlreadyExist FIX
      if (existingDoctorId) {
        doctorPayload.id = existingDoctorId;
        console.log("[Profile Complete] Updating existing doctor with ID:", existingDoctorId);
      } else {
        console.log("[Profile Complete] Creating new doctor profile");
        // id is undefined, will create new
      }

      console.log("[Profile Complete] Calling UpsertDoctor with:", doctorPayload);
      const doctorProfile = await doctorService.upsertDoctor(doctorPayload);
      console.log("[Profile Complete] UpsertDoctor response:", doctorProfile);
      console.log("[Profile Complete] Doctor ID:", doctorProfile?.id);

      if (!doctorProfile || !doctorProfile.id) {
        throw new Error("Profil yaratılmadı - Doctor ID yok");
      }

      // Upload certificates with correct file extension format - SWAGGER UYUMLU
      const uploads: Promise<any>[] = [];

      if (bachelorDiploma) {
        const ext = bachelorDiploma.name.split('.').pop() || 'pdf';
        console.log("[Profile Complete] Uploading bachelor diploma (ext: ." + ext + ")");
        uploads.push(doctorService.uploadCertificate({
          doctorId: doctorProfile.id,      // int64
          categoryId: 1,                   // int64
          file: bachelorDiploma,           // binary
          fileType: `.${ext}`,             // max 32, with dot
          description: "Bakalavr"          // max 500
        }));
      }

      if (masterDiploma) {
        const ext = masterDiploma.name.split('.').pop() || 'pdf';
        console.log("[Profile Complete] Uploading master diploma (ext: ." + ext + ")");
        uploads.push(doctorService.uploadCertificate({
          doctorId: doctorProfile.id,
          categoryId: 2,
          file: masterDiploma,
          fileType: `.${ext}`,
          description: "Magistratura"
        }));
      }

      if (academicDegreeCertificate) {
        const ext = academicDegreeCertificate.name.split('.').pop() || 'pdf';
        uploads.push(doctorService.uploadCertificate({
          doctorId: doctorProfile.id,
          categoryId: 3,
          file: academicDegreeCertificate,
          fileType: `.${ext}`,
          description: "Daraja"
        }));
      }

      if (categoryCertificate) {
        const ext = categoryCertificate.name.split('.').pop() || 'pdf';
        uploads.push(doctorService.uploadCertificate({
          doctorId: doctorProfile.id,
          categoryId: 4,
          file: categoryCertificate,
          fileType: `.${ext}`,
          description: "Toifa"
        }));
      }

      if (uploads.length > 0) {
        console.log(`[Profile Complete] Uploading ${uploads.length} certificates...`);
        await Promise.all(uploads);
        console.log("[Profile Complete] All certificates uploaded!");
      }

      // Cache doctor ID for doctorResolver
      const cacheData = {
        userId: profile.id,
        doctorId: doctorProfile.id,
        timestamp: Date.now(),
      };
      localStorage.setItem("doctor_id_cache", JSON.stringify(cacheData));
      console.log("[Profile Complete] Cached doctor ID for resolver:", doctorProfile.id);

      // Success - redirect to dashboard
      alert("Profil muvaffaqiyatli saqlandi!");
      window.location.href = '/dashboard';

    } catch (error: any) {
      console.error("[Profile Complete] Error:", error);
      console.error("[Profile Complete] Message:", error.message);
      console.error("[Profile Complete] Status:", error.status);
      console.error("[Profile Complete] Code:", error.code);

      // Better error message
      let userMessage = "Xatolik yuz berdi";

      if (error.code === "DoctorAlreadyExist") {
        userMessage = "Profil allaqachon mavjud. Sahifa yangilanmoqda...";
        // Reload to get existing doctor ID from resolver
        setTimeout(() => window.location.reload(), 1500);
      } else if (error.message.includes("UserId")) {
        userMessage = "Foydalanuvchi ID topilmadi. Iltimos qayta login qiling.";
      } else if (error.message.includes("Tam ad") || error.message.includes("İhtisas")) {
        userMessage = `Form validasyon xatosi: ${error.message}`;
      } else {
        userMessage = error.message || userMessage;
      }

      alert(userMessage);
    } finally {
      setLoading(false);
    }
  };

  // Calculate progress
  const completedSections = [
    formData.firstName && formData.email && formData.mobilePhone, // Personal
    formData.bachelorUniversity && bachelorDiploma && formData.masterUniversity && masterDiploma, // Education
    formData.yearsOfExperience, // Experience
    formData.specialization1 && formData.keywords && formData.clinic1Name, // Specialization
    true, // Social media is optional
    true, // Review
  ].filter(Boolean).length;

  const progress = Math.round((completedSections / tabs.length) * 100);

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
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-800">
                Profil ma'lumotlarini to'ldirish
              </h1>
              <p className="text-base text-slate-500">
                Platformada faol bo'lish uchun ma'lumotlaringizni kiriting
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <Button variant="outline" size="default" className="hover:border-teal-500 hover:bg-teal-50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                size="default"
                className="hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
              >
                Chiqish
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-base text-slate-700 mb-3">
              <span className="font-semibold">Jarayon:</span>
              <span className="font-bold text-teal-600">{progress}% to'ldirildi</span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-500 shadow-sm"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Tabs List */}
              <div className="mb-8 overflow-x-auto pb-2">
                <TabsList className="inline-flex h-auto w-full md:w-auto bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    const isActive = activeTab === tab.value;
                    return (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className={`flex-1 md:flex-initial min-w-[100px] rounded-xl transition-all duration-200 ${isActive
                          ? 'bg-teal-50 border-2 border-teal-500 shadow-sm'
                          : 'border-2 border-transparent hover:bg-slate-50'
                          }`}
                      >
                        <div className="flex flex-col items-center gap-2 py-3 px-3">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-gradient-to-br from-teal-500 to-teal-600 shadow-lg shadow-teal-500/20' : tab.bgColor
                            }`}>
                            <IconComponent className={`h-5 w-5 ${isActive ? 'text-white' : tab.iconColor}`} />
                          </div>
                          <span className={`text-sm font-semibold ${isActive ? 'text-teal-700' : 'text-slate-600'
                            }`}>
                            {tab.label}
                          </span>
                        </div>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              {/* Tab Contents */}
              <div className="mb-6">
                <TabsContent value="personal" className="mt-0">
                  <PersonalInfoTab formData={formData} handleInputChange={handleInputChange} />
                </TabsContent>

                <TabsContent value="education" className="mt-0">
                  <EducationTab
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    bachelorDiploma={bachelorDiploma}
                    setBachelorDiploma={setBachelorDiploma}
                    masterDiploma={masterDiploma}
                    setMasterDiploma={setMasterDiploma}
                  />
                </TabsContent>

                <TabsContent value="experience" className="mt-0">
                  <ExperienceTab
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    academicDegreeCertificate={academicDegreeCertificate}
                    setAcademicDegreeCertificate={setAcademicDegreeCertificate}
                    categoryCertificate={categoryCertificate}
                    setCategoryCertificate={setCategoryCertificate}
                    internationalTraining={internationalTraining}
                    handleTrainingChange={handleTrainingChange}
                    addTraining={addTraining}
                    removeTraining={removeTraining}
                  />
                </TabsContent>

                <TabsContent value="specialization" className="mt-0">
                  <SpecializationTab
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleTextareaChange={handleTextareaChange}
                    handleSelectChange={handleSelectChange}
                  />
                </TabsContent>

                <TabsContent value="social" className="mt-0">
                  <SocialMediaTab
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange}
                    handleCheckboxChange={handleCheckboxChange}
                  />
                </TabsContent>

                <TabsContent value="review" className="mt-0">
                  <ReviewTab
                    formData={formData}
                    bachelorDiploma={bachelorDiploma}
                    masterDiploma={masterDiploma}
                    academicDegreeCertificate={academicDegreeCertificate}
                    categoryCertificate={categoryCertificate}
                    internationalTraining={internationalTraining}
                  />
                </TabsContent>
              </div>

              {/* Navigation Buttons */}
              <Card className="border-slate-200">
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-center justify-between gap-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={isFirstTab}
                      className="flex-1 md:flex-initial text-base font-semibold disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5 mr-2" />
                      Orqaga
                    </Button>

                    <div className="hidden md:block text-base text-slate-700 font-semibold">
                      {currentTabIndex + 1} / {tabs.length} - {tabs[currentTabIndex].fullLabel}
                    </div>

                    {!isLastTab ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="flex-1 md:flex-initial text-base font-semibold"
                      >
                        Keyingisi
                        <ChevronRight className="h-5 w-5 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 md:flex-initial text-base font-semibold disabled:opacity-50"
                      >
                        {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        Saqlash va Tugatish
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Tabs>
          </form>
        </div>
      </main>
    </div>
  );
}