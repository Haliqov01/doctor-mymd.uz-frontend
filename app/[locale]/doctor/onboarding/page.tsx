import { redirect } from "next/navigation";

/**
 * Eski onboarding sayfası - artık /dashboard/profile/complete kullanılıyor
 * Bu sayfa geriye uyumluluk için redirect yapar
 */
export default function DoctorOnboardingPage() {
  redirect("/dashboard/profile/complete");
}
