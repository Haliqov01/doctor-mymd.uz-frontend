import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];

export const doctorOnboardingSchema = z.object({
    fullName: z.string().min(2, "Ism va familiya kamida 2 ta belgidan iborat bo'lishi kerak"),
    specialization: z.string().min(2, "Mutaxassislikni kiriting"),
    experienceYears: z.coerce.number().min(0).max(80, "Ish tajribasi 0 va 80 yil oralig'ida bo'lishi kerak"),
    workplace: z.string().optional(),
    biography: z.string().optional(),
    categoryId: z.string().min(1, "Sertifikat turini tanlang"), // Frontend'da string olarak tutulabilir, gonderirken number'a ceviririz
    certificateFile: z
        .custom<FileList>()
        .refine((files) => files?.length === 1, "Sertifikat faylini yuklash majburiy")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, "Fayl hajmi 5MB dan oshmasligi kerak")
        .refine(
            (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
            "Faqat PDF, JPG va PNG formatlari qabul qilinadi"
        ),
    description: z.string().optional(),
});

export type DoctorOnboardingInput = z.infer<typeof doctorOnboardingSchema>;
