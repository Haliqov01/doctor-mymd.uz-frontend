"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { doctorService } from "@/lib/services/doctor.service";
import { authService } from "@/lib/services/auth.service";
import { documentCategoryService, DocumentCategory } from "@/lib/services/document-category.service";
import { doctorOnboardingSchema, type DoctorOnboardingInput } from "@/lib/validations/doctor-onboarding";

export function DoctorOnboardingForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState<DocumentCategory[]>([]);
    const [uploadProgress, setUploadProgress] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(doctorOnboardingSchema),
        defaultValues: {
            experienceYears: 0,
            categoryId: "",
        },
    });

    const selectedFile = watch("certificateFile");

    useEffect(() => {
        // Kategoriyalarni yuklash
        const fetchCategories = async () => {
            try {
                const response = await documentCategoryService.getAllCategories();
                if (response.data) {
                    setCategories(response.data);
                }
            } catch (err) {
                console.error("Kategoriyalarni yuklashda xatolik:", err);
                // Fallback or simple ignore
            }
        };

        fetchCategories();
    }, []);

    const onSubmit = async (data: DoctorOnboardingInput) => {
        setLoading(true);
        setError("");
        setUploadProgress(false);

        try {
            // 1. Get real user profile from API
            const profile = await authService.getProfile();

            if (!profile || !profile.id) {
                throw new Error("Foydalanuvchi ma'lumotlari topilmadi. Iltimos, qayta tizimga kiring.");
            }

            const userId = profile.id;

            // 2. Doktor profilini yaratish (Upsert) - SWAGGER UYUMLU
            const doctorProfile = await doctorService.createDoctorProfile({
                userId: userId,                                    // ZORUNLU (int64)
                fullName: data.fullName.trim(),                    // ZORUNLU (1-200 chars)
                specialization: data.specialization.trim(),        // ZORUNLU (1-100 chars)
                experienceYears: Number(data.experienceYears) || 0, // NUMBER (0-80)
                workplace: data.workplace?.trim() || undefined,    // Optional
                biography: data.biography?.trim() || undefined,    // Optional
                // id: undefined explicitly omitted for new doctor
            });

            if (!doctorProfile || !doctorProfile.id) {
                throw new Error("Doktor profilini yaratishda xatolik yuz berdi.");
            }

            setUploadProgress(true); // Profil yaratildi, endi fayl yuklanmoqda

            // 3. Sertifikat yuklash - SWAGGER UYUMLU
            const file = data.certificateFile[0];
            const fileExtension = file.name.split('.').pop() || "pdf";

            await doctorService.uploadDoctorCertificate({
                doctorId: doctorProfile.id,                // ZORUNLU (int64)
                categoryId: parseInt(data.categoryId),     // ZORUNLU (int64)
                file: file,                                // ZORUNLU (binary)
                fileType: `.${fileExtension}`,             // ZORUNLU (max 32, with dot)
                description: data.description || undefined, // Optional (max 500)
            });

            // Muvaffaqiyatli yakunlash
            router.push("/dashboard");

        } catch (err: any) {
            console.error("[Onboarding] Full Error:", err);
            console.error("[Onboarding] Error message:", err.message);
            console.error("[Onboarding] Error status:", err.status);
            console.error("[Onboarding] Error details:", err.details);

            // Display detailed error
            if (err.status && err.details) {
                const detailsStr = JSON.stringify(err.details);
                setError(`${err.message} - Details: ${detailsStr}`);
            } else {
                setError(err.message || "Xatolik yuz berdi.");
            }
        } finally {
            setLoading(false);
            setUploadProgress(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center text-slate-800">
                    Shifokor Ma'lumotlarini To'ldirish
                </CardTitle>
                <CardDescription className="text-center text-slate-500">
                    Tizimdan foydalanish uchun profilingizni to'ldiring va malaka sertifikatini yuklang.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Ism-familiya */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-slate-700">Ism-familiya *</Label>
                            <Input
                                id="fullName"
                                {...register("fullName")}
                                placeholder="Dr. Aziz Karimov"
                                disabled={loading}
                            />
                            {errors.fullName && (
                                <p className="text-xs text-red-500 font-medium">{errors.fullName.message}</p>
                            )}
                        </div>

                        {/* Mutaxassislik */}
                        <div className="space-y-2">
                            <Label htmlFor="specialization" className="text-slate-700">Mutaxassislik *</Label>
                            <Input
                                id="specialization"
                                {...register("specialization")}
                                placeholder="Kardiolog"
                                disabled={loading}
                            />
                            {errors.specialization && (
                                <p className="text-xs text-red-500 font-medium">{errors.specialization.message}</p>
                            )}
                        </div>

                        {/* Ish tajribasi */}
                        <div className="space-y-2">
                            <Label htmlFor="experienceYears" className="text-slate-700">Ish tajribasi (yil) *</Label>
                            <Input
                                id="experienceYears"
                                type="number"
                                min="0"
                                max="80"
                                {...register("experienceYears")}
                                disabled={loading}
                            />
                            {errors.experienceYears && (
                                <p className="text-xs text-red-500 font-medium">{errors.experienceYears.message}</p>
                            )}
                        </div>

                        {/* Ish joyi */}
                        <div className="space-y-2">
                            <Label htmlFor="workplace" className="text-slate-700">Ish joyi</Label>
                            <Input
                                id="workplace"
                                {...register("workplace")}
                                placeholder="Markaziy shifoxona"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Biografiya */}
                    <div className="space-y-2">
                        <Label htmlFor="biography" className="text-slate-700">Biografiya</Label>
                        <Textarea
                            id="biography"
                            {...register("biography")}
                            placeholder="Malaka va tajribangiz haqida qisqacha..."
                            className="resize-none h-24"
                            disabled={loading}
                        />
                    </div>

                    <div className="border-t border-slate-100 my-6 pt-6">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-teal-600" />
                            Sertifikat Yuklash
                        </h3>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Kategoriya */}
                            <div className="space-y-2">
                                <Label htmlFor="categoryId" className="text-slate-700">Hujjat turi *</Label>
                                <Select
                                    onValueChange={(value) => setValue("categoryId", value)}
                                    disabled={loading}
                                >
                                    <SelectTrigger id="categoryId">
                                        <SelectValue placeholder="Tanlang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.length > 0 ? (
                                            categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                                    {cat.valueUz || cat.keyWord || "Noma'lum kategoriya"}
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value="1">Diplom (Default)</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                {/* Hidden input for validation linkage if needed, but RHF controller is better. 
                    Since I used setValue, I need to make sure register handles it or I manually validate. 
                    Zod schema expects string. 
                    Let's use a hidden input registered to categoryId to ensure RHF sees it if setValue doesn't trigger generic validation 
                    Or just rely on setValue. setValue triggers validation if valid option is passed? 
                    Actually standard way with Shadcn Select and RHF is: */}
                                <input type="hidden" {...register("categoryId")} />
                                {errors.categoryId && (
                                    <p className="text-xs text-red-500 font-medium">{errors.categoryId.message}</p>
                                )}
                            </div>

                            {/* Fayl yuklash */}
                            <div className="space-y-2">
                                <Label htmlFor="certificateFile" className="text-slate-700">Fayl (PDF/JPG/PNG) *</Label>
                                <div className="flex items-center gap-3">
                                    <Input
                                        id="certificateFile"
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        {...register("certificateFile")}
                                        disabled={loading}
                                        className="cursor-pointer file:cursor-pointer file:text-teal-600 file:font-semibold"
                                    />
                                </div>
                                {selectedFile && selectedFile.length > 0 && (
                                    <p className="text-xs text-slate-500 mt-1">
                                        Tanlangan fayl: {selectedFile[0].name} ({(selectedFile[0].size / 1024 / 1024).toFixed(2)} MB)
                                    </p>
                                )}
                                {errors.certificateFile && (
                                    <p className="text-xs text-red-500 font-medium">{errors.certificateFile.message?.toString()}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 mt-4">
                            <Label htmlFor="description" className="text-slate-700">Izoh (ixtiyoriy)</Label>
                            <Input
                                id="description"
                                {...register("description")}
                                placeholder="Fayl bo'yicha qo'shimcha izoh"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-12 text-lg bg-teal-600 hover:bg-teal-700" disabled={loading}>
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                {uploadProgress ? "Sertifikat yuklanmoqda..." : "Profil saqlanmoqda..."}
                            </span>
                        ) : (
                            "Kaydı Tamammlla (Complete Registration)"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
