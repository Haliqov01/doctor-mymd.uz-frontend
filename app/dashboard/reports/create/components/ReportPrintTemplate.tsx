"use client";

import { forwardRef } from "react";
import { EyeReport } from "@/types/report";

interface ReportPrintTemplateProps {
  report: EyeReport;
}

export const ReportPrintTemplate = forwardRef<
  HTMLDivElement,
  ReportPrintTemplateProps
>(({ report }, ref) => {
  
  // Tarih formatlayıcı
  const formatDate = (date: Date | string) => {
    if (!date) return "---";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Veri yoksa tire işareti koyan yardımcı fonksiyon
  const val = (value: any) => value || "—";

  return (
    <div ref={ref} className="bg-white p-4 print:p-0 text-black">
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm 15mm; 
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
            font-family: 'Times New Roman', Times, serif; /* Resmi evrak hissi için */
          }
          
          /* Ana Tablo Stilleri */
          .report-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10pt;
            line-height: 1.3;
            margin-bottom: 10px;
          }
          
          .report-table th, .report-table td {
            border: 1px solid #000;
            padding: 4px 6px;
            vertical-align: middle;
          }

          /* Başlık Hücreleri */
          .header-cell {
            background-color: #f5f5f5;
            font-weight: bold;
            text-align: center;
          }

          .label-cell {
            font-weight: bold;
            background-color: #fafafa;
          }

          /* Refraksiyon (sph/cyl/ax) tablosu için özel stiller */
          .refraction-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            text-align: center;
            width: 100%;
          }
          .refraction-grid span {
            border-right: 1px solid #ddd;
            padding: 0 2px;
          }
          .refraction-grid span:last-child {
            border-right: none;
          }
          
          .section-title {
            font-size: 11pt;
            font-weight: bold;
            margin-top: 10px;
            margin-bottom: 4px;
            text-transform: uppercase;
            border-bottom: 2px solid #000;
            display: inline-block;
          }

          /* Sayfa sonu kontrolleri */
          .no-break {
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* --- HEADER --- */}
      <div className="text-center mb-4 border-b-2 border-black pb-2">
        <h1 className="text-2xl font-bold uppercase tracking-wide">Ko'z Muoyenasi Hisoboti</h1>
        <p className="text-sm mt-1">Sana: {formatDate(report.reportDate)}</p>
      </div>

      {/* --- HASTA BİLGİLERİ --- */}
      <table className="report-table">
        <tbody>
          <tr>
            <td className="label-cell w-[15%]">F.I.Sh. (bemor)</td>
            <td className="w-[45%] font-bold text-lg">{val(report.patientInfo.fullName)}</td>
            <td className="label-cell w-[15%]">Tug'ilgan sanasi</td>
            <td className="w-[15%]">{val(report.patientInfo.dateOfBirth)}</td>
            <td className="label-cell w-[5%]">Jinsi</td>
            <td className="w-[5%]">{val(report.patientInfo.gender)}</td>
          </tr>
          <tr>
            <td className="label-cell">Manzil</td>
            <td colSpan={5}>{val(report.patientInfo.address)}</td>
          </tr>
          <tr>
            <td className="label-cell">Shikoyatlari va anamnez</td>
            <td colSpan={2} style={{verticalAlign: 'top', height: '40px'}}>
               <span className="font-bold text-xs block text-gray-500">Shikoyat:</span>
               {val(report.complaints)}
            </td>
            <td colSpan={3} style={{verticalAlign: 'top'}}>
               <span className="font-bold text-xs block text-gray-500">Anamnez/Yondosh:</span>
               {val(report.anamnesis)} {report.comorbidities ? `/ ${report.comorbidities}` : ''}
            </td>
          </tr>
        </tbody>
      </table>

      {/* --- OBYEKTIV HOLATI (ORTA BÖLÜM) --- */}
      <div className="text-center font-bold mb-1 border-t-2 border-black pt-1 bg-gray-100">
        OBYEKTIV HOLATI
      </div>
      
      <table className="report-table">
        <thead>
          <tr>
            <th className="w-[20%]">Ko'z olmasi qismlari</th>
            <th className="w-[40%]">O'ng ko'z (OD)</th>
            <th className="w-[40%]">Chap ko'z (OS)</th>
          </tr>
        </thead>
        <tbody>
          {[
            { label: "Ko'z olmasi", r: report.rightEye.globe, l: report.leftEye.globe },
            { label: "Ko'z mushaklari", r: report.rightEye.muscles, l: report.leftEye.muscles },
            { label: "Qovoqlar va yosh yo'llari", r: report.rightEye.lidsAndLacrimal, l: report.leftEye.lidsAndLacrimal },
            { label: "Konyunktiva", r: report.rightEye.conjunctiva, l: report.leftEye.conjunctiva },
            { label: "Sklera", r: report.rightEye.sclera, l: report.leftEye.sclera },
            { label: "Shox parda", r: report.rightEye.cornea, l: report.leftEye.cornea },
            { label: "Old kamera", r: report.rightEye.anteriorChamber, l: report.leftEye.anteriorChamber },
            { label: "Rangdor parda", r: report.rightEye.irisAndPupil, l: report.leftEye.irisAndPupil },
            { label: "Gavhar", r: report.rightEye.lens, l: report.leftEye.lens },
            { label: "Shishasimon tana", r: report.rightEye.vitreous, l: report.leftEye.vitreous },
            { label: "Ko'z tubi", r: report.rightEye.fundus, l: report.leftEye.fundus },
          ].map((row, idx) => (
            <tr key={idx}>
              <td className="label-cell text-center">{row.label}</td>
              <td>{val(row.r)}</td>
              <td>{val(row.l)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- KO'RISH O'TKIRLIGI VA O'LCHASHLAR --- */}
      <div className="no-break">
        <table className="report-table">
          <thead>
            <tr>
              <th className="w-[20%]"></th>
              <th colSpan={2} className="w-[40%] text-center">O'ng ko'z (OD)</th>
              <th colSpan={2} className="w-[40%] text-center">Chap ko'z (OS)</th>
            </tr>
          </thead>
          <tbody>
            {/* KO'RISH O'TKIRLIGI - 5 satırlık rowspan */}
            {/* Satır 1: k/siz */}
            <tr>
              <td rowSpan={5} className="label-cell text-center align-middle" style={{ fontSize: '11pt', fontWeight: 'bold' }}>
                Ko'rish<br/>o'tkirligi
              </td>
              <td className="font-bold text-right bg-gray-50 w-[10%]">k/siz</td>
              <td className="text-center w-[30%]">{val(report.rightEye.visualAcuity.uncorrected)}</td>
              <td className="font-bold text-right bg-gray-50 w-[10%]">k/siz</td>
              <td className="text-center w-[30%]">{val(report.leftEye.visualAcuity.uncorrected)}</td>
            </tr>
            {/* Satır 2: b/o (v/o - düzeltme ile) */}
            <tr>
              <td className="font-bold text-right bg-gray-50">b/o</td>
              <td className="text-center">{val(report.rightEye.visualAcuity.corrected)}</td>
              <td className="font-bold text-right bg-gray-50">b/o</td>
              <td className="text-center">{val(report.leftEye.visualAcuity.corrected)}</td>
            </tr>
            {/* Satır 3: sph | cyl | ax başlıkları */}
            <tr>
              <td colSpan={2} className="p-0">
                <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td className="font-bold text-center bg-gray-100 border-r border-gray-300 w-1/3" style={{ fontSize: '9pt', padding: '2px' }}>sph</td>
                      <td className="font-bold text-center bg-gray-100 border-r border-gray-300 w-1/3" style={{ fontSize: '9pt', padding: '2px' }}>cyl</td>
                      <td className="font-bold text-center bg-gray-100 w-1/3" style={{ fontSize: '9pt', padding: '2px' }}>ax</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td colSpan={2} className="p-0">
                <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td className="font-bold text-center bg-gray-100 border-r border-gray-300 w-1/3" style={{ fontSize: '9pt', padding: '2px' }}>sph</td>
                      <td className="font-bold text-center bg-gray-100 border-r border-gray-300 w-1/3" style={{ fontSize: '9pt', padding: '2px' }}>cyl</td>
                      <td className="font-bold text-center bg-gray-100 w-1/3" style={{ fontSize: '9pt', padding: '2px' }}>ax</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            {/* Satır 4: sph | cyl | ax değerleri */}
            <tr>
              <td colSpan={2} className="p-0">
                <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td className="text-center border-r border-gray-300 w-1/3" style={{ padding: '4px 2px' }}>{val(report.rightEye.refraction.sphere)}</td>
                      <td className="text-center border-r border-gray-300 w-1/3" style={{ padding: '4px 2px' }}>{val(report.rightEye.refraction.cylinder)}</td>
                      <td className="text-center w-1/3" style={{ padding: '4px 2px' }}>{val(report.rightEye.refraction.axis)}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td colSpan={2} className="p-0">
                <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td className="text-center border-r border-gray-300 w-1/3" style={{ padding: '4px 2px' }}>{val(report.leftEye.refraction.sphere)}</td>
                      <td className="text-center border-r border-gray-300 w-1/3" style={{ padding: '4px 2px' }}>{val(report.leftEye.refraction.cylinder)}</td>
                      <td className="text-center w-1/3" style={{ padding: '4px 2px' }}>{val(report.leftEye.refraction.axis)}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            {/* Satır 5: k/li */}
            <tr>
              <td className="font-bold text-right bg-gray-50">k/li</td>
              <td className="text-center">{val(report.rightEye.visualAcuity.corrected)}</td>
              <td className="font-bold text-right bg-gray-50">k/li</td>
              <td className="text-center">{val(report.leftEye.visualAcuity.corrected)}</td>
            </tr>

            {/* KIB Satırı - Ölçüm yöntemi ile birlikte */}
            <tr>
              <td className="label-cell text-center">
                KIB<br/>
                <span className="text-xs font-normal" style={{ border: '1px solid #999', padding: '1px 4px', display: 'inline-block', marginTop: '2px' }}>
                  {report.iopMethod || "Maklakov"}
                </span>
              </td>
              <td colSpan={2} className="text-center font-medium">{val(report.rightEye.iop)}</td>
              <td colSpan={2} className="text-center font-medium">{val(report.leftEye.iop)}</td>
            </tr>

            {/* Ko'z o'lchami (mm) */}
            <tr>
              <td className="label-cell text-center">Ko'z o'lchami (mm)</td>
              <td colSpan={2} className="text-center">{val(report.rightEye.axialLength)}</td>
              <td colSpan={2} className="text-center">{val(report.leftEye.axialLength)}</td>
            </tr>

            {/* Shox parda qalinligi (Paximetriya) - Varsa göster */}
            {(report.rightEye.pachymetry || report.leftEye.pachymetry) && (
              <tr>
                <td className="label-cell text-center">Shox parda qalinligi (μm)</td>
                <td colSpan={2} className="text-center">{val(report.rightEye.pachymetry)}</td>
                <td colSpan={2} className="text-center">{val(report.leftEye.pachymetry)}</td>
              </tr>
            )}

            {/* B-Skan - Varsa göster */}
            {(report.rightEye.bScan || report.leftEye.bScan) && (
              <tr>
                <td className="label-cell text-center">B-skan</td>
                <td colSpan={4} className="text-left px-2">{val(report.rightEye.bScan || report.leftEye.bScan)}</td>
              </tr>
            )}

            {/* Gonioskopiya - Varsa göster */}
            {(report.rightEye.gonioscopy || report.leftEye.gonioscopy) && (
              <tr>
                <td className="label-cell text-center">Gonioskopiya</td>
                <td colSpan={4} className="text-left px-2">{val(report.rightEye.gonioscopy || report.leftEye.gonioscopy)}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- TEŞHİS VE TAVSİYE --- */}
      <div className="no-break mt-4">
        <table className="report-table">
          <tbody>
            <tr>
              <td className="label-cell w-[15%] text-lg">Tashhis</td>
              <td className="w-[85%] py-4">
                  <div className="mb-1"><strong>OU:</strong> {val(report.diagnosis.bothEyes)}</div>
                  {report.diagnosis.rightEye && <div><strong>OD:</strong> {report.diagnosis.rightEye}</div>}
                  {report.diagnosis.leftEye && <div><strong>OS:</strong> {report.diagnosis.leftEye}</div>}
              </td>
            </tr>
            <tr>
              <td className="label-cell text-lg">Tavsiya</td>
              <td className="py-4 whitespace-pre-line">
                {val(report.recommendations)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* --- İMZA --- */}
      <div className="mt-8 flex justify-between items-end no-break px-4">
         <div>
            <p className="font-bold text-sm">Shifokor:</p>
            <p className="text-lg">{val(report.doctorInfo.fullName)}</p>
         </div>
         <div className="text-center">
            <div className="border-b border-black w-48 mb-2"></div>
            <p className="text-sm italic">Imzo</p>
         </div>
      </div>

    </div>
  );
});

ReportPrintTemplate.displayName = "ReportPrintTemplate";