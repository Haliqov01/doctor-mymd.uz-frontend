"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Stethoscope, Loader2, Save } from "lucide-react";
import { useWorkingHours } from "./hooks/useWorkingHours";
import { DayCard } from "./components/DayCard";
import { TemplateSelector } from "./components/TemplateSelector";

export default function WorkingHoursPage() {
  const router = useRouter();
  const t = useTranslations();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const dayLabels = {
    MONDAY: t('workingHours.days.monday'),
    TUESDAY: t('workingHours.days.tuesday'),
    WEDNESDAY: t('workingHours.days.wednesday'),
    THURSDAY: t('workingHours.days.thursday'),
    FRIDAY: t('workingHours.days.friday'),
    SATURDAY: t('workingHours.days.saturday'),
    SUNDAY: t('workingHours.days.sunday'),
  };

  const {
    workingHours,
    loading,
    saving,
    updateDay,
    toggleDay,
    copyToAllDays,
    applyTemplate,
    saveWorkingHours,
  } = useWorkingHours();

  const handleSave = async () => {
    const result = await saveWorkingHours();
    setMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    });

    if (result.success) {
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFBFC]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
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
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-800">
                {t('workingHours.title')}
              </h1>
              <p className="text-sm text-slate-500">
                {t('workingHours.schedule')}
              </p>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="hover:border-teal-500 hover:bg-teal-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.backToDashboard')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Message */}
          {message && (
            <Card className={message.type === "success" ? "border-teal-200 bg-teal-50" : "border-red-200 bg-red-50"}>
              <CardContent className="py-4">
                <p className={message.type === "success" ? "text-teal-700" : "text-red-700"}>
                  {message.text}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Template Selector */}
          <TemplateSelector onSelectTemplate={applyTemplate} />

          {/* Day Cards */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">
              {t('workingHours.schedule')}
            </h2>
            {workingHours.map((wh) => (
              <DayCard
                key={wh.dayOfWeek}
                workingHour={wh}
                dayLabel={dayLabels[wh.dayOfWeek]}
                onToggle={() => toggleDay(wh.dayOfWeek)}
                onUpdate={(updates) => updateDay(wh.dayOfWeek, updates)}
                onCopyToAll={() => copyToAllDays(wh.dayOfWeek)}
              />
            ))}
          </div>

          {/* Save Button */}
          <Card className="border-slate-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-slate-500">
                  <p className="font-semibold mb-1 text-slate-700">{t('common.info')}:</p>
                  <p>{t('workingHours.schedule')}</p>
                </div>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="min-w-[150px]"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('common.loading')}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {t('common.save')}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
