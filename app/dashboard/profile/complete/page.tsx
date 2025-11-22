"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Stethoscope, Loader2, ChevronRight, ChevronLeft } from "lucide-react";
import { useProfileForm } from "./hooks/use-profile-form";
import { PersonalInfoTab } from "./components/PersonalInfoTab";
import { EducationTab } from "./components/EducationTab";
import { SpecializationTab } from "./components/SpecializationTab";
import { SocialMediaTab } from "./components/SocialMediaTab";
import { ReviewTab } from "./components/ReviewTab";

const tabs = [
  { value: "personal", label: "Shaxsiy", icon: "👤", fullLabel: "Shaxsiy ma'lumotlar" },
  { value: "education", label: "Ta'lim", icon: "🎓", fullLabel: "Ta'lim ma'lumotlari" },
  { value: "experience", label: "Tajriba", icon: "💼", fullLabel: "Kasbiy tajriba" },
  { value: "specialization", label: "Ixtisoslik", icon: "🎯", fullLabel: "Ixtisoslik" },
  { value: "social", label: "Ijtimoiy", icon: "🌐", fullLabel: "Ijtimoiy tarmoqlar" },
  { value: "review", label: "Tasdiqlash", icon: "✅", fullLabel: "Tasdiqlash" },
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

    // TODO: API call to save profile data
    console.log("Form data:", formData);
    console.log("Files:", {
      bachelorDiploma,
      masterDiploma,
      academicDegreeCertificate,
      categoryCertificate,
    });
    console.log("International training:", internationalTraining);

    setTimeout(() => {
      setLoading(false);
      alert("Profil muvaffaqiyatli saqlandi!");
      router.push("/dashboard/profile");
    }, 1500);
  };

  // Calculate progress
  const completedSections = [
    formData.firstName && formData.email && formData.mobilePhone,
    formData.bachelorUniversity && bachelorDiploma && formData.masterUniversity && masterDiploma,
    formData.yearsOfExperience,
    formData.specialization1 && formData.keywords && formData.clinic1Name,
    true, // Social media is optional
    true, // Review
  ].filter(Boolean).length;

  const progress = Math.round((completedSections / tabs.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Stethoscope className="h-8 w-8 text-green-600" />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Profil ma'lumotlarini to'ldirish
              </h1>
              <p className="text-sm text-gray-600">
                Platformada faol bo'lish uchun ma'lumotlaringizni kiriting
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="bg-green-50 border-green-300 text-green-700 hover:bg-green-100">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboardga qaytish
                </Button>
              </Link>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Jarayon:</span>
              <span className="font-semibold">{progress}% to'ldirildi</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Tabs List */}
              <div className="mb-6 overflow-x-auto">
                <TabsList className="inline-flex h-auto w-full md:w-auto bg-white border rounded-lg p-1 shadow-sm">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex-1 md:flex-initial min-w-[100px] data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
                    >
                      <div className="flex flex-col items-center gap-1 py-2 px-2">
                        <span className="text-xl">{tab.icon}</span>
                        <span className="text-xs hidden md:inline">{tab.label}</span>
                      </div>
                    </TabsTrigger>
                  ))}
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
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={isFirstTab}
                      className="flex-1 md:flex-initial"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Orqaga
                    </Button>

                    <div className="hidden md:block text-sm text-gray-600">
                      {currentTabIndex + 1} / {tabs.length} - {tabs[currentTabIndex].fullLabel}
                    </div>

                    {!isLastTab ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="flex-1 md:flex-initial bg-green-600 hover:bg-green-700"
                      >
                        Keyingisi
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 md:flex-initial bg-green-600 hover:bg-green-700"
                      >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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