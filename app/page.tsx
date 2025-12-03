import Link from "next/link";
import { ArrowRight, Calendar, Clock, Users, Shield, Stethoscope, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-green-100/50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 sm:py-28">
        <div className="flex flex-col items-center text-center">
          {/* Logo/Brand */}
          <div className="mb-12 animate-fade-in">
            {/* Medical Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 opacity-20 blur-3xl rounded-full"></div>
                <div className="relative h-20 w-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-soft-lg">
                  <Stethoscope className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-bold text-neutral-900 mb-4">
              Doctor <span className="text-green-600">MyMD</span>
            </h1>
            <p className="text-xl sm:text-2xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Zamonaviy va qulay shifokor bilan uchrashuv tizimi
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white bg-green-600 rounded-xl hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              Tizimga kirish
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-green-700 bg-white border-2 border-green-300 rounded-xl hover:border-green-500 hover:bg-green-50 shadow-md hover:shadow-lg transition-all duration-200"
            >
              Ro'yxatdan o'tish
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
            <div className="group flex flex-col items-center p-8 bg-white rounded-2xl shadow-soft hover:shadow-soft-lg border border-neutral-100 hover:border-green-200 transition-all duration-200">
              <div className="p-4 bg-green-100 rounded-xl mb-5 group-hover:bg-green-200 transition-colors">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                Oson Uchrashuv
              </h3>
              <p className="text-base text-neutral-600 text-center leading-relaxed">
                Tez va qulay uchrashuv yaratish
              </p>
            </div>

            <div className="group flex flex-col items-center p-8 bg-white rounded-2xl shadow-soft hover:shadow-soft-lg border border-neutral-100 hover:border-green-200 transition-all duration-200">
              <div className="p-4 bg-green-100 rounded-xl mb-5 group-hover:bg-green-200 transition-colors">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                Vaqt Boshqaruvi
              </h3>
              <p className="text-base text-neutral-600 text-center leading-relaxed">
                Samarali soat va taqvim boshqaruvi
              </p>
            </div>

            <div className="group flex flex-col items-center p-8 bg-white rounded-2xl shadow-soft hover:shadow-soft-lg border border-neutral-100 hover:border-green-200 transition-all duration-200">
              <div className="p-4 bg-green-100 rounded-xl mb-5 group-hover:bg-green-200 transition-colors">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                Bemor Kuzatuvi
              </h3>
              <p className="text-base text-neutral-600 text-center leading-relaxed">
                Batafsil bemor ro'yxati tizimi
              </p>
            </div>

            <div className="group flex flex-col items-center p-8 bg-white rounded-2xl shadow-soft hover:shadow-soft-lg border border-neutral-100 hover:border-green-200 transition-all duration-200">
              <div className="p-4 bg-green-100 rounded-xl mb-5 group-hover:bg-green-200 transition-colors">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                Xavfsiz Tizim
              </h3>
              <p className="text-base text-neutral-600 text-center leading-relaxed">
                Ma'lumotlaringiz xavfsizligi kafolatlangan
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badge Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-200 shadow-soft p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Shifokorlar uchun ishonchli yechim
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed">
                Bemor bilan aloqani osonlashtiring, vaqtingizni tejang va xizmat sifatini oshiring.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-base text-neutral-600">
              © 2025 Doctor MyMD. Barcha huquqlar himoyalangan.
            </p>
            <div className="flex items-center gap-2 text-neutral-600">
              <Heart className="h-4 w-4 text-green-600 fill-green-600" />
              <span className="text-sm">O'zbekiston shifokorlari uchun</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
