import { z } from "zod";

// Doctor Registration Step 1 Schema (Register sayfası için SMS verification öncesi)
export const doctorRegistrationStep1Schema = z.object({
  firstName: z.string().min(1, "Ism kiriting").min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
  lastName: z.string().min(1, "Familiya kiriting").min(2, "Familiya kamida 2 ta belgidan iborat bo'lishi kerak"),
  email: z.string().min(1, "Email kiriting").email("To'g'ri email kiriting"),
  phoneNumber: z
    .string()
    .min(9, "Telefon raqami 9 ta raqamdan iborat bo'lishi kerak")
    .max(9, "Telefon raqami 9 ta raqamdan iborat bo'lishi kerak")
    .regex(/^\d{9}$/, "Faqat raqamlarni kiriting (901234567)"),
});

export type DoctorRegistrationStep1Input = z.infer<typeof doctorRegistrationStep1Schema>;

// Doctor Registration Schema (Full - SMS verification sonrası)
export const doctorRegistrationSchema = z
  .object({
    firstName: z.string().min(1, "Ism kiriting"),
    lastName: z.string().min(1, "Familiya kiriting"),
    email: z.string().email("To'g'ri email kiriting"),
    phoneNumber: z
      .string()
      .regex(/^\+998\d{9}$/, "To'g'ri format: +998XXXXXXXXX"),
    password: z
      .string()
      .min(8, "Parol kamida 8 ta belgidan iborat bo'lishi kerak")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Parol kamida bitta katta harf, bitta kichik harf va bitta raqam bo'lishi kerak"
      ),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Parollar mos emas",
    path: ["passwordConfirm"],
  });

export type DoctorRegistrationInput = z.infer<typeof doctorRegistrationSchema>;

// Doctor Login Schema
export const doctorLoginSchema = z.object({
  phoneNumber: z
    .string()
    .min(9, "Telefon raqami 9 ta raqamdan iborat bo'lishi kerak")
    .max(9, "Telefon raqami 9 ta raqamdan iborat bo'lishi kerak")
    .regex(/^\d{9}$/, "Faqat raqamlarni kiriting (901234567)"),
  password: z.string().min(1, "Parolni kiriting"),
});

export type DoctorLoginInput = z.infer<typeof doctorLoginSchema>;
