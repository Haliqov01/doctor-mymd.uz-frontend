"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Printer, 
  Eye, 
  User, 
  Stethoscope, 
  ClipboardList, 
  Activity,
  FileText,
  ChevronRight,
  Copy,
  CheckCircle2,
  Save,
  Loader2
} from "lucide-react";
import { reportService } from "@/lib/services/report.service";
import { doctorService, appointmentService } from "@/lib/services";
import { doctorResolver } from "@/lib/services/doctorResolver";
import { PatientInfoSection } from "./components/PatientInfoSection";
import { ExaminationField } from "./components/ExaminationField";
import { ReportPrintTemplate } from "./components/ReportPrintTemplate";
import { ComplaintsSection } from "./components/ComplaintsSection";
import { ComorbiditiesSection } from "./components/ComorbiditiesSection";
import { EXAMINATION_OPTIONS, NORMAL_VALUES } from "@/lib/examination-options";
import { EyeReport, EyeExamination, PatientInfo } from "@/types/report";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function CreateReportPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const printRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();

  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState("patient");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // URL'den gelen parametreler
  const [appointmentId, setAppointmentId] = useState<number | null>(null);
  const [patientId, setPatientId] = useState<number | null>(null);
  
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    fullName: "",
    address: "",
    dateOfBirth: "",
    gender: "Erkak",
  });

  const [complaints, setComplaints] = useState("");
  const [anamnesis, setAnamnesis] = useState("");
  const [comorbidities, setComorbidities] = useState("");
  const [iopMethod, setIopMethod] = useState("Maklakov");

  const [rightEye, setRightEye] = useState<EyeExamination>({
    globe: NORMAL_VALUES.globe,
    muscles: NORMAL_VALUES.muscles,
    lidsAndLacrimal: NORMAL_VALUES.lidsAndLacrimal,
    conjunctiva: NORMAL_VALUES.conjunctiva,
    sclera: NORMAL_VALUES.sclera,
    cornea: NORMAL_VALUES.cornea,
    anteriorChamber: NORMAL_VALUES.anteriorChamber,
    irisAndPupil: NORMAL_VALUES.irisAndPupil,
    lens: NORMAL_VALUES.lens,
    vitreous: NORMAL_VALUES.vitreous,
    fundus: NORMAL_VALUES.fundus,
    visualAcuity: { uncorrected: "", corrected: "" },
    refraction: { sphere: "", cylinder: "", axis: "" },
    iop: "",
    axialLength: "",
    bScan: "",
    pachymetry: "",
    gonioscopy: "",
  });

  const [leftEye, setLeftEye] = useState<EyeExamination>({
    globe: NORMAL_VALUES.globe,
    muscles: NORMAL_VALUES.muscles,
    lidsAndLacrimal: NORMAL_VALUES.lidsAndLacrimal,
    conjunctiva: NORMAL_VALUES.conjunctiva,
    sclera: NORMAL_VALUES.sclera,
    cornea: NORMAL_VALUES.cornea,
    anteriorChamber: NORMAL_VALUES.anteriorChamber,
    irisAndPupil: NORMAL_VALUES.irisAndPupil,
    lens: NORMAL_VALUES.lens,
    vitreous: NORMAL_VALUES.vitreous,
    fundus: NORMAL_VALUES.fundus,
    visualAcuity: { uncorrected: "", corrected: "" },
    refraction: { sphere: "", cylinder: "", axis: "" },
    iop: "",
    axialLength: "",
    bScan: "",
    pachymetry: "",
    gonioscopy: "",
  });

  const [diagnosis, setDiagnosis] = useState({
    rightEye: "",
    leftEye: "",
    bothEyes: "",
  });

  const [recommendations, setRecommendations] = useState("");

  const [doctorInfo, setDoctorInfo] = useState({
    fullName: t('common.loading'),
    specialization: "Ko'z shifokori",
    licenseNumber: "",
  });

  const updateRightEye = (field: keyof EyeExamination, value: any) => {
    setRightEye({ ...rightEye, [field]: value });
  };

  const updateLeftEye = (field: keyof EyeExamination, value: any) => {
    setLeftEye({ ...leftEye, [field]: value });
  };

  const report: EyeReport = {
    reportDate: new Date(),
    patientInfo,
    complaints,
    anamnesis,
    comorbidities,
    rightEye,
    leftEye,
    iopMethod,
    diagnosis,
    recommendations,
    doctorInfo,
  };

  const sections = [
    { id: "patient", label: t('reports.sections.patient'), icon: User },
    { id: "complaints", label: t('reports.sections.complaint'), icon: ClipboardList },
    { id: "examination", label: t('reports.sections.examination'), icon: Stethoscope },
    { id: "measurements", label: t('reports.sections.measurement'), icon: Activity },
    { id: "diagnosis", label: t('reports.sections.diagnosis'), icon: FileText },
  ];

  // URL parametrelerini oku
  useEffect(() => {
    const aptId = searchParams.get('appointmentId');
    const ptId = searchParams.get('patientId');
    const ptName = searchParams.get('patientName');
    const complaint = searchParams.get('complaint');

    if (aptId) setAppointmentId(parseInt(aptId));
    if (ptId) setPatientId(parseInt(ptId));
    if (ptName) setPatientInfo(prev => ({ ...prev, fullName: decodeURIComponent(ptName) }));
    if (complaint) setComplaints(decodeURIComponent(complaint));
  }, [searchParams]);

  // Doktor bilgilerini yukla
  useEffect(() => {
    const loadDoctorInfo = async () => {
      try {
        const doctorId = await doctorResolver.resolve();
        if (doctorId) {
          const doctor = await doctorService.getDoctorById(doctorId);
          if (doctor) {
            setDoctorInfo({
              fullName: doctor.fullName || "Shifokor",
              specialization: doctor.specialization || "Ko'z shifokori",
              licenseNumber: "",
            });
          }
        }
      } catch (error) {
        console.error("Error loading doctor info:", error);
        setDoctorInfo({
          fullName: "Shifokor",
          specialization: "Ko'z shifokori",
          licenseNumber: "",
        });
      }
    };
    loadDoctorInfo();
  }, []);

  // Backend'e kaydet
  const handleSaveReport = async () => {
    if (!patientId) {
      alert(t('reports.errors.patientIdNotFound'));
      return;
    }

    if (!patientInfo.fullName.trim()) {
      alert(t('reports.errors.patientNameRequired'));
      return;
    }

    setSaving(true);
    try {
      const { doctorResolver } = await import("@/lib/services/doctorResolver");
      const doctorId = await doctorResolver.resolve();

      if (!doctorId) {
        throw new Error(t('reports.errors.doctorNotFound'));
      }

      console.log("Saving report...", { patientId, doctorId, appointmentId });

      const result = await reportService.createReport({
        patientId: patientId,
        doctorId: doctorId,
        reportText: JSON.stringify(report),
        appointmentId: appointmentId || undefined,
        notes: `Ko'z muoyenasi - ${new Date().toLocaleDateString('uz-UZ')}`,
      });

      console.log("Report saved:", result);
      
      // Randevunu tamamlangan holatına geçirme
      if (appointmentId) {
        try {
          await appointmentService.completeAppointment(appointmentId);
          console.log("Appointment completed:", appointmentId);
        } catch (completeError) {
          console.warn("Error completing appointment (report saved):", completeError);
        }
      }
      
      setSaveSuccess(true);
      
      // 2 saniye sonra dashboard'a git
      setTimeout(() => {
        router.push("/dashboard/appointments");
      }, 2000);
    } catch (error: any) {
      console.error("Save error:", error);
      alert(error.message || t('reports.errors.saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Ko'z Tahlili - ${patientInfo.fullName}</title>
              <style>
                @page {
                  size: A4;
                  margin: 10mm 12mm;
                }
                body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  font-size: 10pt;
                  line-height: 1.4;
                  margin: 0;
                  padding: 0;
                  color: #1e293b;
                  print-color-adjust: exact;
                  -webkit-print-color-adjust: exact;
                }
                * { box-sizing: border-box; }
                
                .print-container {
                  max-width: 210mm;
                  margin: 0 auto;
                  padding: 20px;
                  font-size: 10pt;
                  line-height: 1.4;
                  color: #1e293b;
                }
                
                .report-header {
                  text-align: center;
                  border-bottom: 3px solid #0d9488;
                  padding-bottom: 12px;
                  margin-bottom: 16px;
                }
                
                .report-header h1 {
                  font-size: 18pt;
                  font-weight: 700;
                  color: #0d9488;
                  margin: 0 0 4px 0;
                  letter-spacing: 0.5px;
                }
                
                .report-header .date {
                  font-size: 10pt;
                  color: #64748b;
                }
                
                .section {
                  margin-bottom: 14px;
                  page-break-inside: avoid;
                }
                
                .section-title {
                  font-size: 11pt;
                  font-weight: 700;
                  color: #0f766e;
                  padding: 6px 10px;
                  background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
                  border-left: 4px solid #0d9488;
                  margin-bottom: 10px;
                  border-radius: 0 6px 6px 0;
                }
                
                .info-grid {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 8px;
                  margin-bottom: 12px;
                }
                
                .info-item {
                  display: flex;
                  align-items: baseline;
                  gap: 8px;
                  padding: 6px 10px;
                  background: #f8fafc;
                  border-radius: 6px;
                  border: 1px solid #e2e8f0;
                }
                
                .info-item.full-width {
                  grid-column: span 2;
                }
                
                .info-label {
                  font-weight: 600;
                  color: #64748b;
                  font-size: 9pt;
                  min-width: 100px;
                }
                
                .info-value {
                  color: #1e293b;
                  font-weight: 500;
                }
                
                .info-value.highlight {
                  font-size: 12pt;
                  font-weight: 700;
                  color: #0f766e;
                }
                
                .exam-table {
                  width: 100%;
                  border-collapse: collapse;
                  font-size: 9pt;
                  margin-bottom: 12px;
                }
                
                .exam-table th {
                  background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
                  color: white;
                  font-weight: 600;
                  padding: 8px 10px;
                  text-align: center;
                  font-size: 10pt;
                }
                
                .exam-table th:first-child {
                  border-radius: 8px 0 0 0;
                  text-align: left;
                }
                
                .exam-table th:last-child {
                  border-radius: 0 8px 0 0;
                }
                
                .exam-table td {
                  padding: 6px 10px;
                  border-bottom: 1px solid #e2e8f0;
                  vertical-align: middle;
                }
                
                .exam-table tr:nth-child(even) {
                  background: #f8fafc;
                }
                
                .exam-table .label-cell {
                  font-weight: 600;
                  color: #475569;
                  width: 25%;
                  background: #f1f5f9;
                }
                
                .exam-table .value-cell {
                  width: 37.5%;
                }
                
                .measurements-grid {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr);
                  gap: 12px;
                  margin-bottom: 12px;
                }
                
                .eye-card {
                  border: 2px solid #e2e8f0;
                  border-radius: 10px;
                  overflow: hidden;
                }
                
                .eye-card.right {
                  border-color: #99f6e4;
                }
                
                .eye-card.left {
                  border-color: #bfdbfe;
                }
                
                .eye-card-header {
                  padding: 8px 12px;
                  font-weight: 700;
                  font-size: 11pt;
                  display: flex;
                  align-items: center;
                  gap: 8px;
                }
                
                .eye-card.right .eye-card-header {
                  background: linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%);
                  color: #0f766e;
                }
                
                .eye-card.left .eye-card-header {
                  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
                  color: #1e40af;
                }
                
                .eye-badge {
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 9pt;
                  font-weight: 700;
                  color: white;
                }
                
                .eye-card.right .eye-badge {
                  background: #0d9488;
                }
                
                .eye-card.left .eye-badge {
                  background: #2563eb;
                }
                
                .eye-card-content {
                  padding: 10px 12px;
                }
                
                .measurement-row {
                  display: flex;
                  justify-content: space-between;
                  padding: 5px 0;
                  border-bottom: 1px dashed #e2e8f0;
                }
                
                .measurement-row:last-child {
                  border-bottom: none;
                }
                
                .measurement-label {
                  color: #64748b;
                  font-size: 9pt;
                }
                
                .measurement-value {
                  font-weight: 600;
                  color: #1e293b;
                }
                
                .refraction-box {
                  display: grid;
                  grid-template-columns: repeat(3, 1fr);
                  gap: 4px;
                  margin-top: 8px;
                  padding: 8px;
                  background: #f8fafc;
                  border-radius: 6px;
                }
                
                .refraction-item {
                  text-align: center;
                }
                
                .refraction-item .label {
                  font-size: 8pt;
                  color: #94a3b8;
                  font-weight: 600;
                }
                
                .refraction-item .value {
                  font-size: 11pt;
                  font-weight: 700;
                  color: #1e293b;
                }
                
                .diagnosis-box {
                  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                  border: 2px solid #f59e0b;
                  border-radius: 10px;
                  padding: 12px 16px;
                  margin-bottom: 12px;
                }
                
                .diagnosis-box h3 {
                  font-size: 12pt;
                  font-weight: 700;
                  color: #92400e;
                  margin: 0 0 8px 0;
                  display: flex;
                  align-items: center;
                  gap: 6px;
                }
                
                .diagnosis-content {
                  font-size: 10pt;
                  color: #78350f;
                  line-height: 1.5;
                }
                
                .diagnosis-content strong {
                  color: #92400e;
                }
                
                .recommendations-box {
                  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
                  border: 2px solid #10b981;
                  border-radius: 10px;
                  padding: 12px 16px;
                  margin-bottom: 16px;
                }
                
                .recommendations-box h3 {
                  font-size: 12pt;
                  font-weight: 700;
                  color: #065f46;
                  margin: 0 0 8px 0;
                }
                
                .recommendations-content {
                  font-size: 10pt;
                  color: #064e3b;
                  line-height: 1.6;
                  white-space: pre-line;
                }
                
                .signature-section {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-end;
                  margin-top: 24px;
                  padding-top: 16px;
                  border-top: 2px solid #e2e8f0;
                }
                
                .doctor-info {
                  font-size: 10pt;
                }
                
                .doctor-info .title {
                  color: #64748b;
                  font-size: 9pt;
                }
                
                .doctor-info .name {
                  font-size: 12pt;
                  font-weight: 700;
                  color: #1e293b;
                }
                
                .signature-box {
                  text-align: center;
                }
                
                .signature-line {
                  width: 150px;
                  border-bottom: 2px solid #1e293b;
                  margin-bottom: 4px;
                }
                
                .signature-label {
                  font-size: 9pt;
                  color: #64748b;
                  font-style: italic;
                }
              </style>
            </head>
            <body>
              ${printRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
    }
  };

  const copyToLeftEye = () => {
    setLeftEye({ ...rightEye });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
                  {t('reports.eyeExam')}
                </h1>
                <p className="text-sm text-slate-500">
                  {t('reports.createNew')}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/appointments")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back')}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className={showPreview ? "border-teal-500 bg-teal-50 text-teal-700" : ""}
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? t('common.showForm') : t('common.preview')}
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                {t('common.print')}
              </Button>
              {patientId && (
                <Button 
                  onClick={handleSaveReport} 
                  disabled={saving || saveSuccess}
                  className={saveSuccess ? "bg-green-600 hover:bg-green-600" : ""}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('common.saving')}
                    </>
                  ) : saveSuccess ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {t('common.saved')}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {t('common.save')}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 py-8">
        {showPreview ? (
          <Card className="max-w-[210mm] mx-auto shadow-lg border-slate-200">
            <CardContent className="p-0">
              <ReportPrintTemplate ref={printRef} report={report} />
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Section Navigation */}
            <div className="mb-8">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {sections.map((section, idx) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/20"
                          : "bg-white border border-slate-200 text-slate-600 hover:border-teal-300 hover:bg-teal-50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {section.label}
                      {idx < sections.length - 1 && (
                        <ChevronRight className={`h-4 w-4 ${isActive ? "text-white/60" : "text-slate-300"}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Patient Info Section */}
            {activeSection === "patient" && (
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-slate-800">{t('reports.create.patientInfo')}</CardTitle>
                      <CardDescription>{t('reports.create.patientInfoDesc')}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <PatientInfoSection
                    patientInfo={patientInfo}
                    onChange={setPatientInfo}
                  />
                  <div className="flex justify-end mt-6">
                    <Button onClick={() => setActiveSection("complaints")}>
                      {t('common.next')}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Complaints Section */}
            {activeSection === "complaints" && (
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-orange-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <ClipboardList className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-slate-800">{t('reports.create.complaintsAnamnesis')}</CardTitle>
                      <CardDescription>{t('reports.create.complaintsDesc')}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <ComplaintsSection
                    complaints={complaints}
                    onChange={setComplaints}
                  />
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">{t('reports.create.anamnesis')}</Label>
                    <Textarea
                      value={anamnesis}
                      onChange={(e) => setAnamnesis(e.target.value)}
                      placeholder={t('reports.create.anamnesisPlaceholder')}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                  
                  <ComorbiditiesSection
                    comorbidities={comorbidities}
                    onChange={setComorbidities}
                  />
                  
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setActiveSection("patient")}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      {t('common.back')}
                    </Button>
                    <Button onClick={() => setActiveSection("examination")}>
                      {t('common.next')}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Examination Section */}
            {activeSection === "examination" && (
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-violet-50 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-violet-100 rounded-xl flex items-center justify-center">
                        <Stethoscope className="h-5 w-5 text-violet-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-slate-800">{t('reports.create.objectiveExam')}</CardTitle>
                        <CardDescription>{t('reports.create.objectiveExamDesc')}</CardDescription>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyToLeftEye}
                      className={`transition-all ${copied ? "border-teal-500 bg-teal-50 text-teal-700" : "hover:border-teal-300"}`}
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          {t('common.copied')}
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          {t('reports.eye.copyRightToLeft')}
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <Tabs defaultValue="right" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="right" className="gap-2">
                        <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs flex items-center justify-center font-bold">OD</span>
                        {t('reports.eye.right')}
                      </TabsTrigger>
                      <TabsTrigger value="left" className="gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">OS</span>
                        {t('reports.eye.left')}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="right" className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        <ExaminationField label="Ko'z olmasi" value={rightEye.globe} onChange={(v) => updateRightEye("globe", v)} options={EXAMINATION_OPTIONS.globe} />
                        <ExaminationField label="Ko'z mushaklari" value={rightEye.muscles} onChange={(v) => updateRightEye("muscles", v)} options={EXAMINATION_OPTIONS.muscles} />
                        <ExaminationField label="Qovoqlar va ko'z yosh yo'llari" value={rightEye.lidsAndLacrimal} onChange={(v) => updateRightEye("lidsAndLacrimal", v)} options={EXAMINATION_OPTIONS.lidsAndLacrimal} />
                        <ExaminationField label="Konyunktiva" value={rightEye.conjunctiva} onChange={(v) => updateRightEye("conjunctiva", v)} options={EXAMINATION_OPTIONS.conjunctiva} />
                        <ExaminationField label="Sklera" value={rightEye.sclera} onChange={(v) => updateRightEye("sclera", v)} options={EXAMINATION_OPTIONS.sclera} />
                        <ExaminationField label="Shox parda" value={rightEye.cornea} onChange={(v) => updateRightEye("cornea", v)} options={EXAMINATION_OPTIONS.cornea} />
                        <ExaminationField label="Old kamera" value={rightEye.anteriorChamber} onChange={(v) => updateRightEye("anteriorChamber", v)} options={EXAMINATION_OPTIONS.anteriorChamber} />
                        <ExaminationField label="Rangdor parda va qorachiq" value={rightEye.irisAndPupil} onChange={(v) => updateRightEye("irisAndPupil", v)} options={EXAMINATION_OPTIONS.irisAndPupil} />
                        <ExaminationField label="Gavhar" value={rightEye.lens} onChange={(v) => updateRightEye("lens", v)} options={EXAMINATION_OPTIONS.lens} />
                        <ExaminationField label="Shishasimon tana" value={rightEye.vitreous} onChange={(v) => updateRightEye("vitreous", v)} options={EXAMINATION_OPTIONS.vitreous} />
                      </div>
                      <ExaminationField label="Ko'z tubi" value={rightEye.fundus} onChange={(v) => updateRightEye("fundus", v)} options={EXAMINATION_OPTIONS.fundus} />
                    </TabsContent>

                    <TabsContent value="left" className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        <ExaminationField label="Ko'z olmasi" value={leftEye.globe} onChange={(v) => updateLeftEye("globe", v)} options={EXAMINATION_OPTIONS.globe} />
                        <ExaminationField label="Ko'z mushaklari" value={leftEye.muscles} onChange={(v) => updateLeftEye("muscles", v)} options={EXAMINATION_OPTIONS.muscles} />
                        <ExaminationField label="Qovoqlar va ko'z yosh yo'llari" value={leftEye.lidsAndLacrimal} onChange={(v) => updateLeftEye("lidsAndLacrimal", v)} options={EXAMINATION_OPTIONS.lidsAndLacrimal} />
                        <ExaminationField label="Konyunktiva" value={leftEye.conjunctiva} onChange={(v) => updateLeftEye("conjunctiva", v)} options={EXAMINATION_OPTIONS.conjunctiva} />
                        <ExaminationField label="Sklera" value={leftEye.sclera} onChange={(v) => updateLeftEye("sclera", v)} options={EXAMINATION_OPTIONS.sclera} />
                        <ExaminationField label="Shox parda" value={leftEye.cornea} onChange={(v) => updateLeftEye("cornea", v)} options={EXAMINATION_OPTIONS.cornea} />
                        <ExaminationField label="Old kamera" value={leftEye.anteriorChamber} onChange={(v) => updateLeftEye("anteriorChamber", v)} options={EXAMINATION_OPTIONS.anteriorChamber} />
                        <ExaminationField label="Rangdor parda va qorachiq" value={leftEye.irisAndPupil} onChange={(v) => updateLeftEye("irisAndPupil", v)} options={EXAMINATION_OPTIONS.irisAndPupil} />
                        <ExaminationField label="Gavhar" value={leftEye.lens} onChange={(v) => updateLeftEye("lens", v)} options={EXAMINATION_OPTIONS.lens} />
                        <ExaminationField label="Shishasimon tana" value={leftEye.vitreous} onChange={(v) => updateLeftEye("vitreous", v)} options={EXAMINATION_OPTIONS.vitreous} />
                      </div>
                      <ExaminationField label="Ko'z tubi" value={leftEye.fundus} onChange={(v) => updateLeftEye("fundus", v)} options={EXAMINATION_OPTIONS.fundus} />
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setActiveSection("complaints")}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      {t('common.back')}
                    </Button>
                    <Button onClick={() => setActiveSection("measurements")}>
                      {t('common.next')}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Measurements Section */}
            {activeSection === "measurements" && (
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-teal-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-teal-100 rounded-xl flex items-center justify-center">
                      <Activity className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-slate-800">{t('reports.create.measurements')}</CardTitle>
                      <CardDescription>{t('reports.create.measurementsDesc')}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Right Eye Measurements */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white text-sm flex items-center justify-center font-bold shadow-lg shadow-teal-500/20">OD</span>
                        <h3 className="text-lg font-semibold text-slate-800">{t('reports.eye.right')}</h3>
                      </div>
                      
                      {/* Visual Acuity */}
                      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-4">
                        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Eye className="h-4 w-4 text-blue-600" />
                          {t('reports.eye.visualAcuity')}
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-600">{t('reports.eye.uncorrected')}</Label>
                            <Input
                              value={rightEye.visualAcuity.uncorrected}
                              onChange={(e) => updateRightEye("visualAcuity", { ...rightEye.visualAcuity, uncorrected: e.target.value })}
                              placeholder="0.5"
                              className="bg-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-600">{t('reports.eye.corrected')}</Label>
                            <Input
                              value={rightEye.visualAcuity.corrected}
                              onChange={(e) => updateRightEye("visualAcuity", { ...rightEye.visualAcuity, corrected: e.target.value })}
                              placeholder="1.0"
                              className="bg-white"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Refraction */}
                      <div className="p-4 bg-violet-50/50 rounded-xl border border-violet-100 space-y-4">
                        <h4 className="text-sm font-semibold text-slate-700">{t('reports.eye.refraction')}</h4>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-600">Sph</Label>
                            <Input value={rightEye.refraction.sphere} onChange={(e) => updateRightEye("refraction", { ...rightEye.refraction, sphere: e.target.value })} placeholder="-1.5" className="bg-white" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-600">Cyl</Label>
                            <Input value={rightEye.refraction.cylinder} onChange={(e) => updateRightEye("refraction", { ...rightEye.refraction, cylinder: e.target.value })} placeholder="-0.5" className="bg-white" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-600">Ax</Label>
                            <Input value={rightEye.refraction.axis} onChange={(e) => updateRightEye("refraction", { ...rightEye.refraction, axis: e.target.value })} placeholder="90°" className="bg-white" />
                          </div>
                        </div>
                      </div>
                      
                      {/* IOP and other measurements */}
                      <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 space-y-4">
                        <h4 className="text-sm font-semibold text-slate-700">{t('reports.eye.additionalMeasures')}</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-600">KIB (mmHg)</Label>
                            <Input value={rightEye.iop} onChange={(e) => updateRightEye("iop", e.target.value)} placeholder="15" className="bg-white" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-600">Ko'z o'lchami (mm)</Label>
                            <Input value={rightEye.axialLength} onChange={(e) => updateRightEye("axialLength", e.target.value)} placeholder="23.5" className="bg-white" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-600">Paximetriya (μm)</Label>
                            <Input value={rightEye.pachymetry} onChange={(e) => updateRightEye("pachymetry", e.target.value)} placeholder="550" className="bg-white" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Left Eye Measurements */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm flex items-center justify-center font-bold shadow-lg shadow-blue-500/20">OS</span>
                        <h3 className="text-lg font-semibold text-slate-800">{t('reports.eye.left')}</h3>
                      </div>
                      
                      {/* Visual Acuity */}
                      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-4">
                        <h4 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Eye className="h-4 w-4 text-blue-600" />
                          {t('reports.eye.visualAcuity')}
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-600">{t('reports.eye.uncorrected')}</Label>
                            <Input
                              value={leftEye.visualAcuity.uncorrected}
                              onChange={(e) => updateLeftEye("visualAcuity", { ...leftEye.visualAcuity, uncorrected: e.target.value })}
                              placeholder="0.5"
                              className="bg-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-600">{t('reports.eye.corrected')}</Label>
                            <Input
                              value={leftEye.visualAcuity.corrected}
                              onChange={(e) => updateLeftEye("visualAcuity", { ...leftEye.visualAcuity, corrected: e.target.value })}
                              placeholder="1.0"
                              className="bg-white"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Refraction */}
                      <div className="p-4 bg-violet-50/50 rounded-xl border border-violet-100 space-y-4">
                        <h4 className="text-sm font-semibold text-slate-700">{t('reports.eye.refraction')}</h4>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-600">Sph</Label>
                            <Input value={leftEye.refraction.sphere} onChange={(e) => updateLeftEye("refraction", { ...leftEye.refraction, sphere: e.target.value })} placeholder="-1.5" className="bg-white" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-600">Cyl</Label>
                            <Input value={leftEye.refraction.cylinder} onChange={(e) => updateLeftEye("refraction", { ...leftEye.refraction, cylinder: e.target.value })} placeholder="-0.5" className="bg-white" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-600">Ax</Label>
                            <Input value={leftEye.refraction.axis} onChange={(e) => updateLeftEye("refraction", { ...leftEye.refraction, axis: e.target.value })} placeholder="90°" className="bg-white" />
                          </div>
                        </div>
                      </div>
                      
                      {/* IOP and other measurements */}
                      <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 space-y-4">
                        <h4 className="text-sm font-semibold text-slate-700">{t('reports.eye.additionalMeasures')}</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-600">KIB (mmHg)</Label>
                            <Input value={leftEye.iop} onChange={(e) => updateLeftEye("iop", e.target.value)} placeholder="15" className="bg-white" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-600">Ko'z o'lchami (mm)</Label>
                            <Input value={leftEye.axialLength} onChange={(e) => updateLeftEye("axialLength", e.target.value)} placeholder="23.5" className="bg-white" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-slate-600">Paximetriya (μm)</Label>
                            <Input value={leftEye.pachymetry} onChange={(e) => updateLeftEye("pachymetry", e.target.value)} placeholder="550" className="bg-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* IOP Method Selection */}
                  <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-4">
                      <Label className="text-sm font-medium text-slate-700 whitespace-nowrap">{t('reports.eye.iopMethod')}:</Label>
                      <Select value={iopMethod} onValueChange={setIopMethod}>
                        <SelectTrigger className="w-48 bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {EXAMINATION_OPTIONS.iopMethods.map((method) => (
                            <SelectItem key={method} value={method}>{method}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setActiveSection("examination")}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      {t('common.back')}
                    </Button>
                    <Button onClick={() => setActiveSection("diagnosis")}>
                      {t('common.next')}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Diagnosis Section */}
            {activeSection === "diagnosis" && (
              <div className="space-y-6">
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-rose-50 to-white">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-rose-100 rounded-xl flex items-center justify-center">
                        <FileText className="h-5 w-5 text-rose-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-slate-800">{t('reports.create.diagnosis')}</CardTitle>
                        <CardDescription>{t('reports.create.diagnosisDesc')}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 pt-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">OU ({t('reports.eye.both')})</Label>
                      <Textarea
                        value={diagnosis.bothEyes}
                        onChange={(e) => setDiagnosis({ ...diagnosis, bothEyes: e.target.value })}
                        placeholder={t('reports.eye.bothDiagnosis')}
                        rows={2}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-xs flex items-center justify-center font-bold">OD</span>
                          <Label className="text-sm font-medium text-slate-700">{t('reports.eye.rightDiagnosis')}</Label>
                        </div>
                        <Textarea
                          value={diagnosis.rightEye}
                          onChange={(e) => setDiagnosis({ ...diagnosis, rightEye: e.target.value })}
                          placeholder={t('reports.eye.rightDiagnosis')}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">OS</span>
                          <Label className="text-sm font-medium text-slate-700">{t('reports.eye.leftDiagnosis')}</Label>
                        </div>
                        <Textarea
                          value={diagnosis.leftEye}
                          onChange={(e) => setDiagnosis({ ...diagnosis, leftEye: e.target.value })}
                          placeholder={t('reports.eye.leftDiagnosis')}
                          rows={3}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-teal-50 to-white">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-teal-100 rounded-xl flex items-center justify-center">
                        <ClipboardList className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-slate-800">{t('reports.create.recommendationsTitle')}</CardTitle>
                        <CardDescription>{t('reports.create.recommendationsDesc')}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Textarea
                      value={recommendations}
                      onChange={(e) => setRecommendations(e.target.value)}
                      placeholder={t('reports.create.recommendationsPlaceholder')}
                      rows={5}
                      className="resize-none"
                    />
                  </CardContent>
                </Card>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveSection("measurements")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('common.back')}
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setShowPreview(true)}>
                      <Eye className="h-4 w-4 mr-2" />
                      {t('common.preview')}
                    </Button>
                    <Button variant="outline" onClick={handlePrint}>
                      <Printer className="h-4 w-4 mr-2" />
                      {t('common.print')}
                    </Button>
                    {patientId && (
                      <Button 
                        onClick={handleSaveReport} 
                        disabled={saving || saveSuccess}
                        className={saveSuccess ? "bg-green-600 hover:bg-green-600" : ""}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {t('common.saving')}
                          </>
                        ) : saveSuccess ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            {t('common.saved')}
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            {t('common.save')}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Hidden print template */}
      <div className="hidden">
        <ReportPrintTemplate ref={printRef} report={report} />
      </div>
    </div>
  );
}

// Suspense wrapper - useSearchParams() için gerekli
export default function CreateReportPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <span className="ml-2 text-muted-foreground">Yuklanmoqda...</span>
      </div>
    }>
      <CreateReportPageContent />
    </Suspense>
  );
}
