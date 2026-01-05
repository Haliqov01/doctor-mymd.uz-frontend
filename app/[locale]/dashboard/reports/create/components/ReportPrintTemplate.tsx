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
  
  const formatDate = (date: Date | string) => {
    if (!date) return "---";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const val = (value: any) => value || "—";

  return (
    <div ref={ref} className="bg-white text-black" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm 12mm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
        
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
        
        .exam-table tr:hover {
          background: #f0fdfa;
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
      `}</style>

      <div className="print-container">
        {/* Header */}
        <div className="report-header">
          <h1>KO'Z KO'RIGI NATIJALARI</h1>
          <div className="date">Sana: {formatDate(report.reportDate)}</div>
        </div>

        {/* Patient Info Section */}
        <div className="section">
          <div className="section-title">BEMOR MA'LUMOTLARI</div>
          <div className="info-grid">
            <div className="info-item full-width">
              <span className="info-label">F.I.Sh.:</span>
              <span className="info-value highlight">{val(report.patientInfo.fullName)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Tug'ilgan sana:</span>
              <span className="info-value">{val(report.patientInfo.dateOfBirth)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Jinsi:</span>
              <span className="info-value">{val(report.patientInfo.gender)}</span>
            </div>
            <div className="info-item full-width">
              <span className="info-label">Manzil:</span>
              <span className="info-value">{val(report.patientInfo.address)}</span>
            </div>
          </div>
        </div>

        {/* Complaints Section */}
        <div className="section">
          <div className="section-title">SHIKOYATLARI VA ANAMNEZ</div>
          <div className="info-grid">
            <div className="info-item full-width">
              <span className="info-label">Shikoyat:</span>
              <span className="info-value">{val(report.complaints)}</span>
            </div>
            <div className="info-item full-width">
              <span className="info-label">Anamnez:</span>
              <span className="info-value">{val(report.anamnesis)}</span>
            </div>
            {report.comorbidities && (
              <div className="info-item full-width">
                <span className="info-label">Yondosh kasalliklar:</span>
                <span className="info-value">{report.comorbidities}</span>
              </div>
            )}
          </div>
        </div>

        {/* Examination Table */}
        <div className="section">
          <div className="section-title">OBYEKTIV HOLATI</div>
          <table className="exam-table">
            <thead>
              <tr>
                <th>Ko'z qismi</th>
                <th>O'ng ko'z (OD)</th>
                <th>Chap ko'z (OS)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Ko'z olmasi", r: report.rightEye.globe, l: report.leftEye.globe },
                { label: "Ko'z mushaklari", r: report.rightEye.muscles, l: report.leftEye.muscles },
                { label: "Qovoqlar", r: report.rightEye.lidsAndLacrimal, l: report.leftEye.lidsAndLacrimal },
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
                  <td className="label-cell">{row.label}</td>
                  <td className="value-cell">{val(row.r)}</td>
                  <td className="value-cell">{val(row.l)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measurements Section */}
        <div className="section">
          <div className="section-title">O'LCHOVLAR</div>
          <div className="measurements-grid">
            {/* Right Eye Card */}
            <div className="eye-card right">
              <div className="eye-card-header">
                <span className="eye-badge">OD</span>
                O'ng ko'z
              </div>
              <div className="eye-card-content">
                <div className="measurement-row">
                  <span className="measurement-label">Ko'rish (k/siz):</span>
                  <span className="measurement-value">{val(report.rightEye.visualAcuity.uncorrected)}</span>
                </div>
                <div className="measurement-row">
                  <span className="measurement-label">Ko'rish (k/li):</span>
                  <span className="measurement-value">{val(report.rightEye.visualAcuity.corrected)}</span>
                </div>
                <div className="measurement-row">
                  <span className="measurement-label">KIB ({report.iopMethod}):</span>
                  <span className="measurement-value">{val(report.rightEye.iop)} mmHg</span>
                </div>
                {report.rightEye.axialLength && (
                  <div className="measurement-row">
                    <span className="measurement-label">Ko'z o'lchami:</span>
                    <span className="measurement-value">{report.rightEye.axialLength} mm</span>
                  </div>
                )}
                {report.rightEye.pachymetry && (
                  <div className="measurement-row">
                    <span className="measurement-label">Paximetriya:</span>
                    <span className="measurement-value">{report.rightEye.pachymetry} μm</span>
                  </div>
                )}
                <div className="refraction-box">
                  <div className="refraction-item">
                    <div className="label">Sph</div>
                    <div className="value">{val(report.rightEye.refraction.sphere)}</div>
                  </div>
                  <div className="refraction-item">
                    <div className="label">Cyl</div>
                    <div className="value">{val(report.rightEye.refraction.cylinder)}</div>
                  </div>
                  <div className="refraction-item">
                    <div className="label">Ax</div>
                    <div className="value">{val(report.rightEye.refraction.axis)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Eye Card */}
            <div className="eye-card left">
              <div className="eye-card-header">
                <span className="eye-badge">OS</span>
                Chap ko'z
              </div>
              <div className="eye-card-content">
                <div className="measurement-row">
                  <span className="measurement-label">Ko'rish (k/siz):</span>
                  <span className="measurement-value">{val(report.leftEye.visualAcuity.uncorrected)}</span>
                </div>
                <div className="measurement-row">
                  <span className="measurement-label">Ko'rish (k/li):</span>
                  <span className="measurement-value">{val(report.leftEye.visualAcuity.corrected)}</span>
                </div>
                <div className="measurement-row">
                  <span className="measurement-label">KIB ({report.iopMethod}):</span>
                  <span className="measurement-value">{val(report.leftEye.iop)} mmHg</span>
                </div>
                {report.leftEye.axialLength && (
                  <div className="measurement-row">
                    <span className="measurement-label">Ko'z o'lchami:</span>
                    <span className="measurement-value">{report.leftEye.axialLength} mm</span>
                  </div>
                )}
                {report.leftEye.pachymetry && (
                  <div className="measurement-row">
                    <span className="measurement-label">Paximetriya:</span>
                    <span className="measurement-value">{report.leftEye.pachymetry} μm</span>
                  </div>
                )}
                <div className="refraction-box">
                  <div className="refraction-item">
                    <div className="label">Sph</div>
                    <div className="value">{val(report.leftEye.refraction.sphere)}</div>
                  </div>
                  <div className="refraction-item">
                    <div className="label">Cyl</div>
                    <div className="value">{val(report.leftEye.refraction.cylinder)}</div>
                  </div>
                  <div className="refraction-item">
                    <div className="label">Ax</div>
                    <div className="value">{val(report.leftEye.refraction.axis)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="section">
          <div className="diagnosis-box">
            <h3>TASHHIS</h3>
            <div className="diagnosis-content">
              {report.diagnosis.bothEyes && <div><strong>OU:</strong> {report.diagnosis.bothEyes}</div>}
              {report.diagnosis.rightEye && <div><strong>OD:</strong> {report.diagnosis.rightEye}</div>}
              {report.diagnosis.leftEye && <div><strong>OS:</strong> {report.diagnosis.leftEye}</div>}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {report.recommendations && (
          <div className="section">
            <div className="recommendations-box">
              <h3>TAVSIYA VA DAVOLASH REJASI</h3>
              <div className="recommendations-content">
                {report.recommendations}
              </div>
            </div>
          </div>
        )}

        {/* Signature */}
        <div className="signature-section">
          <div className="doctor-info">
            <div className="title">Shifokor:</div>
            <div className="name">{val(report.doctorInfo.fullName)}</div>
            <div className="title">{report.doctorInfo.specialization}</div>
          </div>
          <div className="signature-box">
            <div className="signature-line"></div>
            <div className="signature-label">Imzo</div>
          </div>
        </div>
      </div>
    </div>
  );
});

ReportPrintTemplate.displayName = "ReportPrintTemplate";
