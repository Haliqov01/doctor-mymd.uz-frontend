// Göz Muayene Raporu için tip tanımlamaları

export interface PatientInfo {
  fullName: string;
  address: string;
  dateOfBirth: string;
  gender: "Erkak" | "Ayol";
}

export interface VisualAcuity {
  uncorrected: string;  // Ko'rish o'tkirligi k/siz
  corrected: string;    // Ko'rish o'tkirligi k/bilan
}

export interface Refraction {
  sphere: string;   // sph
  cylinder: string; // cyl
  axis: string;     // ax
}

export interface EyeExamination {
  // Anatomik muayene
  globe: string;                // Ko'z olmasi
  muscles: string;              // Ko'z mushaklari
  lidsAndLacrimal: string;      // Qovoqlar va ko'z yosh yo'llari
  conjunctiva: string;          // Konyunktiva
  sclera: string;               // Sklera
  cornea: string;               // Shox parda
  anteriorChamber: string;      // Old kamera va ko'z ichi suyuqligi
  irisAndPupil: string;         // Rangdor parda va qorachiq
  lens: string;                 // Gavhar
  vitreous: string;             // Shishasimon tana
  fundus: string;               // Ko'z tubi
  
  // Ölçümler
  visualAcuity: VisualAcuity;
  refraction: Refraction;
  iop: string;                  // KIB (Ko'z ichi bosimi)
  axialLength: string;          // Ko'z o'lchami
  bScan: string;                // B skan
  pachymetry: string;           // Shox parda markaziy qalinligi
  gonioscopy: string;           // Gonioskopiya
}

export interface EyeReport {
  id?: string;
  reportDate: Date;
  
  // Hasta Bilgileri
  patientInfo: PatientInfo;
  
  // Şikayetler ve Anamnez
  complaints: string;           // Shikoyatlari
  anamnesis: string;            // Anamnez
  comorbidities: string;        // Yondosh kasalliklar
  
  // Muayene Bulguları
  bothEyes?: string;            // OU (Her iki göz için ortak)
  rightEye: EyeExamination;     // O'ng ko'z
  leftEye: EyeExamination;      // Chap ko'z
  
  // Ölçüm Yöntemleri
  iopMethod?: string;           // KIB o'lchash usuli
  
  // Tanı ve Tedavi
  diagnosis: {
    rightEye: string;           // O'ng ko'z tashxis
    leftEye: string;            // Chap ko'z tashxis
    bothEyes: string;           // OU (Her iki göz)
  };
  
  recommendations: string;      // Tavsiya
  
  // Doktor Bilgileri
  doctorInfo: {
    fullName: string;
    specialization: string;
    licenseNumber?: string;
    signature?: string;
  };
}

