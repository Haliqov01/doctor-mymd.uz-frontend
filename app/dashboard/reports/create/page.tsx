"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Printer, Save, Eye } from "lucide-react";
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

export default function CreateReportPage() {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  const [showPreview, setShowPreview] = useState(false);
  
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
    doctorInfo: {
      fullName: "Dr. [Ism Familiya]",
      specialization: "Ko'z shifokori",
      licenseNumber: "",
    },
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
                  margin: 15mm 20mm;
                }
                body {
                  font-family: Arial, sans-serif;
                  font-size: 11pt;
                  line-height: 1.4;
                  margin: 0;
                  padding: 20px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 10px;
                  font-size: 8.5pt;
                  line-height: 1.2;
                }
                td, th {
                  border: 1px solid #000;
                  padding: 3px 5px;
                  vertical-align: top;
                  text-align: left;
                }
                th {
                  background-color: #f0f0f0;
                  font-weight: bold;
                }
                .text-center { text-align: center; }
                .font-bold { font-weight: bold; }
                h1 { font-size: 18pt; margin-bottom: 10px; }
                h3 { font-size: 13pt; margin: 15px 0 10px 0; }
                
                /* Sayfa kırılımı önleme */
                .measurements-section {
                  page-break-inside: avoid;
                  break-inside: avoid;
                  page-break-before: auto;
                  break-before: auto;
                }
                
                .no-break-table {
                  page-break-inside: avoid;
                  break-inside: avoid;
                }
                
                .objective-guaranteed {
                  page-break-inside: avoid;
                  break-inside: avoid;
                }
                
                .two-column-container {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 8px;
                  margin-bottom: 8px;
                }
                
                .compact-section {
                  max-height: 100px;
                  overflow: hidden;
                  line-height: 1.2;
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Ana Renk Yeşil */}
      <header className="bg-gradient-to-r from-green-600 to-green-700 border-b shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Ko'z Muoyenasi Hisoboti
              </h1>
              <p className="text-sm text-green-50 mt-1">
                Yangi hisobot yaratish
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Orqaga
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? "Formani ko'rish" : "Oldindan ko'rish"}
              </Button>
              <Button
                onClick={handlePrint}
                className="bg-white text-green-600 hover:bg-green-50 font-medium shadow-md"
              >
                <Printer className="h-4 w-4 mr-2" />
                Chop etish
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {showPreview ? (
          <Card className="max-w-[210mm] mx-auto shadow-lg">
            <CardContent className="p-0">
              <ReportPrintTemplate ref={printRef} report={report} />
            </CardContent>
          </Card>
        ) : (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Patient Info */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-white border-b">
                <CardTitle className="text-lg text-gray-900">Bemor ma'lumotlari</CardTitle>
              </CardHeader>
              <CardContent className="bg-white pt-6">
                <PatientInfoSection
                  patientInfo={patientInfo}
                  onChange={setPatientInfo}
                />
              </CardContent>
            </Card>

            {/* Complaints and Anamnesis */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-white border-b">
                <CardTitle className="text-lg text-gray-900">Shikoyatlari va Anamnez</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 bg-white pt-6">
                <ComplaintsSection
                  complaints={complaints}
                  onChange={setComplaints}
                />
                
                <div className="space-y-2">
                  <Label>Anamnez (Kasallik tarixi)</Label>
                  <Textarea
                    value={anamnesis}
                    onChange={(e) => setAnamnesis(e.target.value)}
                    placeholder="Kasallik tarixi, o'tgan muoyenalar, davolash..."
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500">
                    Maksimal 5-6 qator yozish tavsiya etiladi (A4 formatga mos)
                  </p>
                </div>
                
                <ComorbiditiesSection
                  comorbidities={comorbidities}
                  onChange={setComorbidities}
                />
              </CardContent>
            </Card>

            {/* Eye Examination */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-white border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg text-gray-900">Obyektiv Muoyena</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyToLeftEye}
                    className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 font-medium"
                  >
                    O'ng ko'zdan chap ko'zga nusxalash
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="bg-white pt-6">
                <Tabs defaultValue="right" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1">
                    <TabsTrigger value="right" className="data-[state=active]:bg-white">O'ng ko'z (OD)</TabsTrigger>
                    <TabsTrigger value="left" className="data-[state=active]:bg-white">Chap ko'z (OS)</TabsTrigger>
                  </TabsList>

                  {/* Right Eye */}
                  <TabsContent value="right" className="space-y-3 mt-6">
                    <ExaminationField
                      label="Ko'z olmasi"
                      value={rightEye.globe}
                      onChange={(v) => updateRightEye("globe", v)}
                      options={EXAMINATION_OPTIONS.globe}
                    />
                    <ExaminationField
                      label="Ko'z mushaklari"
                      value={rightEye.muscles}
                      onChange={(v) => updateRightEye("muscles", v)}
                      options={EXAMINATION_OPTIONS.muscles}
                    />
                    <ExaminationField
                      label="Qovoqlar va ko'z yosh yo'llari"
                      value={rightEye.lidsAndLacrimal}
                      onChange={(v) => updateRightEye("lidsAndLacrimal", v)}
                      options={EXAMINATION_OPTIONS.lidsAndLacrimal}
                    />
                    <ExaminationField
                      label="Konyunktiva"
                      value={rightEye.conjunctiva}
                      onChange={(v) => updateRightEye("conjunctiva", v)}
                      options={EXAMINATION_OPTIONS.conjunctiva}
                    />
                    <ExaminationField
                      label="Sklera"
                      value={rightEye.sclera}
                      onChange={(v) => updateRightEye("sclera", v)}
                      options={EXAMINATION_OPTIONS.sclera}
                    />
                    <ExaminationField
                      label="Shox parda"
                      value={rightEye.cornea}
                      onChange={(v) => updateRightEye("cornea", v)}
                      options={EXAMINATION_OPTIONS.cornea}
                    />
                    <ExaminationField
                      label="Old kamera va ko'z ichi suyuqligi"
                      value={rightEye.anteriorChamber}
                      onChange={(v) => updateRightEye("anteriorChamber", v)}
                      options={EXAMINATION_OPTIONS.anteriorChamber}
                    />
                    <ExaminationField
                      label="Rangdor parda va qorachiq"
                      value={rightEye.irisAndPupil}
                      onChange={(v) => updateRightEye("irisAndPupil", v)}
                      options={EXAMINATION_OPTIONS.irisAndPupil}
                    />
                    <ExaminationField
                      label="Gavhar"
                      value={rightEye.lens}
                      onChange={(v) => updateRightEye("lens", v)}
                      options={EXAMINATION_OPTIONS.lens}
                    />
                    <ExaminationField
                      label="Shishasimon tana"
                      value={rightEye.vitreous}
                      onChange={(v) => updateRightEye("vitreous", v)}
                      options={EXAMINATION_OPTIONS.vitreous}
                    />
                    <ExaminationField
                      label="Ko'z tubi"
                      value={rightEye.fundus}
                      onChange={(v) => updateRightEye("fundus", v)}
                      options={EXAMINATION_OPTIONS.fundus}
                    />

                    {/* Visual Acuity */}
                    <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 space-y-3 mt-6">
                      <h4 className="text-sm font-semibold text-gray-700">Ko'rish o'tkirligi</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Tuzatishsiz</Label>
                          <Input
                            value={rightEye.visualAcuity.uncorrected}
                            onChange={(e) =>
                              updateRightEye("visualAcuity", {
                                ...rightEye.visualAcuity,
                                uncorrected: e.target.value,
                              })
                            }
                            placeholder="0.5"
                            className="bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Tuzatish bilan</Label>
                          <Input
                            value={rightEye.visualAcuity.corrected}
                            onChange={(e) =>
                              updateRightEye("visualAcuity", {
                                ...rightEye.visualAcuity,
                                corrected: e.target.value,
                              })
                            }
                            placeholder="1.0"
                            className="bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Refraction */}
                    <div className="p-4 bg-purple-50/50 rounded-lg border border-purple-100 space-y-3">
                      <h4 className="text-sm font-semibold text-gray-700">Refraksiya</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Sph</Label>
                          <Input
                            value={rightEye.refraction.sphere}
                            onChange={(e) =>
                              updateRightEye("refraction", {
                                ...rightEye.refraction,
                                sphere: e.target.value,
                              })
                            }
                            placeholder="-1.5"
                            className="bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Cyl</Label>
                          <Input
                            value={rightEye.refraction.cylinder}
                            onChange={(e) =>
                              updateRightEye("refraction", {
                                ...rightEye.refraction,
                                cylinder: e.target.value,
                              })
                            }
                            placeholder="-0.5"
                            className="bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Ax</Label>
                          <Input
                            value={rightEye.refraction.axis}
                            onChange={(e) =>
                              updateRightEye("refraction", {
                                ...rightEye.refraction,
                                axis: e.target.value,
                              })
                            }
                            placeholder="90°"
                            className="bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Measurements */}
                    <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-100 space-y-3">
                      <h4 className="text-sm font-semibold text-gray-700">Qo'shimcha o'lchovlar</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">KIB o'lchash usuli</Label>
                          <Select value={iopMethod} onValueChange={setIopMethod}>
                            <SelectTrigger className="bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {EXAMINATION_OPTIONS.iopMethods.map((method) => (
                                <SelectItem key={method} value={method}>
                                  {method}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">KIB (mmHg)</Label>
                          <Input
                            value={rightEye.iop}
                            onChange={(e) => updateRightEye("iop", e.target.value)}
                            placeholder="15"
                            className="bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Ko'z o'lchami (mm)</Label>
                          <Input
                            value={rightEye.axialLength}
                            onChange={(e) =>
                              updateRightEye("axialLength", e.target.value)
                            }
                            placeholder="23.5"
                            className="bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Shox parda qalinligi (μm)</Label>
                          <Input
                            value={rightEye.pachymetry}
                            onChange={(e) =>
                              updateRightEye("pachymetry", e.target.value)
                            }
                            placeholder="550"
                            className="bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <Label className="text-sm font-medium text-gray-700">B-skan</Label>
                      <Textarea
                        value={rightEye.bScan}
                        onChange={(e) => updateRightEye("bScan", e.target.value)}
                        placeholder="B-skan natijalari..."
                        rows={2}
                        className="resize-none bg-white"
                      />
                    </div>

                    <div className="space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <Label className="text-sm font-medium text-gray-700">Gonioskopiya</Label>
                      <Textarea
                        value={rightEye.gonioscopy}
                        onChange={(e) =>
                          updateRightEye("gonioscopy", e.target.value)
                        }
                        placeholder="Gonioskopiya natijalari..."
                        rows={2}
                        className="resize-none bg-white"
                      />
                    </div>
                  </TabsContent>

                  {/* Left Eye */}
                  <TabsContent value="left" className="space-y-3 mt-6">
                    <ExaminationField
                      label="Ko'z olmasi"
                      value={leftEye.globe}
                      onChange={(v) => updateLeftEye("globe", v)}
                      options={EXAMINATION_OPTIONS.globe}
                    />
                    <ExaminationField
                      label="Ko'z mushaklari"
                      value={leftEye.muscles}
                      onChange={(v) => updateLeftEye("muscles", v)}
                      options={EXAMINATION_OPTIONS.muscles}
                    />
                    <ExaminationField
                      label="Qovoqlar va ko'z yosh yo'llari"
                      value={leftEye.lidsAndLacrimal}
                      onChange={(v) => updateLeftEye("lidsAndLacrimal", v)}
                      options={EXAMINATION_OPTIONS.lidsAndLacrimal}
                    />
                    <ExaminationField
                      label="Konyunktiva"
                      value={leftEye.conjunctiva}
                      onChange={(v) => updateLeftEye("conjunctiva", v)}
                      options={EXAMINATION_OPTIONS.conjunctiva}
                    />
                    <ExaminationField
                      label="Sklera"
                      value={leftEye.sclera}
                      onChange={(v) => updateLeftEye("sclera", v)}
                      options={EXAMINATION_OPTIONS.sclera}
                    />
                    <ExaminationField
                      label="Shox parda"
                      value={leftEye.cornea}
                      onChange={(v) => updateLeftEye("cornea", v)}
                      options={EXAMINATION_OPTIONS.cornea}
                    />
                    <ExaminationField
                      label="Old kamera va ko'z ichi suyuqligi"
                      value={leftEye.anteriorChamber}
                      onChange={(v) => updateLeftEye("anteriorChamber", v)}
                      options={EXAMINATION_OPTIONS.anteriorChamber}
                    />
                    <ExaminationField
                      label="Rangdor parda va qorachiq"
                      value={leftEye.irisAndPupil}
                      onChange={(v) => updateLeftEye("irisAndPupil", v)}
                      options={EXAMINATION_OPTIONS.irisAndPupil}
                    />
                    <ExaminationField
                      label="Gavhar"
                      value={leftEye.lens}
                      onChange={(v) => updateLeftEye("lens", v)}
                      options={EXAMINATION_OPTIONS.lens}
                    />
                    <ExaminationField
                      label="Shishasimon tana"
                      value={leftEye.vitreous}
                      onChange={(v) => updateLeftEye("vitreous", v)}
                      options={EXAMINATION_OPTIONS.vitreous}
                    />
                    <ExaminationField
                      label="Ko'z tubi"
                      value={leftEye.fundus}
                      onChange={(v) => updateLeftEye("fundus", v)}
                      options={EXAMINATION_OPTIONS.fundus}
                    />

                    {/* Visual Acuity */}
                    <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 space-y-3 mt-6">
                      <h4 className="text-sm font-semibold text-gray-700">Ko'rish o'tkirligi</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Tuzatishsiz</Label>
                          <Input
                            value={leftEye.visualAcuity.uncorrected}
                            onChange={(e) =>
                              updateLeftEye("visualAcuity", {
                                ...leftEye.visualAcuity,
                                uncorrected: e.target.value,
                              })
                            }
                            placeholder="0.5"
                            className="bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Tuzatish bilan</Label>
                          <Input
                            value={leftEye.visualAcuity.corrected}
                            onChange={(e) =>
                              updateLeftEye("visualAcuity", {
                                ...leftEye.visualAcuity,
                                corrected: e.target.value,
                              })
                            }
                            placeholder="1.0"
                            className="bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Refraction */}
                    <div className="p-4 bg-purple-50/50 rounded-lg border border-purple-100 space-y-3">
                      <h4 className="text-sm font-semibold text-gray-700">Refraksiya</h4>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Sph</Label>
                          <Input
                            value={leftEye.refraction.sphere}
                            onChange={(e) =>
                              updateLeftEye("refraction", {
                                ...leftEye.refraction,
                                sphere: e.target.value,
                              })
                            }
                            placeholder="-1.5"
                            className="bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Cyl</Label>
                          <Input
                            value={leftEye.refraction.cylinder}
                            onChange={(e) =>
                              updateLeftEye("refraction", {
                                ...leftEye.refraction,
                                cylinder: e.target.value,
                              })
                            }
                            placeholder="-0.5"
                            className="bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Ax</Label>
                          <Input
                            value={leftEye.refraction.axis}
                            onChange={(e) =>
                              updateLeftEye("refraction", {
                                ...leftEye.refraction,
                                axis: e.target.value,
                              })
                            }
                            placeholder="90°"
                            className="bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Measurements */}
                    <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-100 space-y-3">
                      <h4 className="text-sm font-semibold text-gray-700">Qo'shimcha o'lchovlar</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">KIB o'lchash usuli</Label>
                          <Select value={iopMethod} onValueChange={setIopMethod}>
                            <SelectTrigger className="bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {EXAMINATION_OPTIONS.iopMethods.map((method) => (
                                <SelectItem key={method} value={method}>
                                  {method}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">KIB (mmHg)</Label>
                          <Input
                            value={leftEye.iop}
                            onChange={(e) => updateLeftEye("iop", e.target.value)}
                            placeholder="15"
                            className="bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Ko'z o'lchami (mm)</Label>
                          <Input
                            value={leftEye.axialLength}
                            onChange={(e) =>
                              updateLeftEye("axialLength", e.target.value)
                            }
                            placeholder="23.5"
                            className="bg-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-600">Shox parda qalinligi (μm)</Label>
                          <Input
                            value={leftEye.pachymetry}
                            onChange={(e) =>
                              updateLeftEye("pachymetry", e.target.value)
                            }
                            placeholder="550"
                            className="bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <Label className="text-sm font-medium text-gray-700">B-skan</Label>
                      <Textarea
                        value={leftEye.bScan}
                        onChange={(e) => updateLeftEye("bScan", e.target.value)}
                        placeholder="B-skan natijalari..."
                        rows={2}
                        className="resize-none bg-white"
                      />
                    </div>

                    <div className="space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <Label className="text-sm font-medium text-gray-700">Gonioskopiya</Label>
                      <Textarea
                        value={leftEye.gonioscopy}
                        onChange={(e) =>
                          updateLeftEye("gonioscopy", e.target.value)
                        }
                        placeholder="Gonioskopiya natijalari..."
                        rows={2}
                        className="resize-none bg-white"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Diagnosis */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-white border-b">
                <CardTitle className="text-lg text-gray-900">Tashhis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 bg-white pt-6">
                <div className="space-y-2">
                  <Label>OU (Ikkala ko'z)</Label>
                  <Textarea
                    value={diagnosis.bothEyes}
                    onChange={(e) =>
                      setDiagnosis({ ...diagnosis, bothEyes: e.target.value })
                    }
                    placeholder="Har ikkala ko'z uchun umumiy tashxis..."
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>OD (O'ng ko'z)</Label>
                    <Textarea
                      value={diagnosis.rightEye}
                      onChange={(e) =>
                        setDiagnosis({ ...diagnosis, rightEye: e.target.value })
                      }
                      placeholder="O'ng ko'z tashxisi..."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>OS (Chap ko'z)</Label>
                    <Textarea
                      value={diagnosis.leftEye}
                      onChange={(e) =>
                        setDiagnosis({ ...diagnosis, leftEye: e.target.value })
                      }
                      placeholder="Chap ko'z tashxisi..."
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-white border-b">
                <CardTitle className="text-lg text-gray-900">Tavsiya va Davolash Rejasi</CardTitle>
              </CardHeader>
              <CardContent className="bg-white pt-6">
                <Textarea
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  placeholder="Davolash rejasi, tavsiyalar, keyingi nazorat muoyenasi..."
                  rows={5}
                  className="resize-none"
                />
              </CardContent>
            </Card>
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

