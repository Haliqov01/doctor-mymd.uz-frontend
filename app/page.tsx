import Link from "next/link";
import { ArrowRight, Calendar, Clock, Users, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="flex flex-col items-center text-center">
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1 className="text-5xl sm:text-6xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              Doctor <span className="text-blue-600 dark:text-blue-500">MyMD</span>
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Modern ve kullanıcı dostu doktor randevu yönetim sistemi
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Giriş Yap
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
              Kayıt Ol
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
            <div className="flex flex-col items-center p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-4">
                <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Kolay Randevu
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
                Hızlı ve pratik randevu oluşturma
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg mb-4">
                <Clock className="h-8 w-8 text-green-600 dark:text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Zaman Yönetimi
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
                Etkin saat ve takvim yönetimi
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-4">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Hasta Takibi
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
                Detaylı hasta kayıt sistemi
              </p>
            </div>

            <div className="flex flex-col items-center p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg mb-4">
                <Shield className="h-8 w-8 text-orange-600 dark:text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Güvenli Sistem
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center">
                Verileriniz güvende
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-16">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            © 2025 Doctor MyMD. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}
