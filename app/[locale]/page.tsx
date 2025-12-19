import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight, Calendar, Clock, Users, Shield, Stethoscope, Heart } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function Home() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/[0.02] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/[0.02] rounded-full blur-[100px]" />
      </div>
      
      {/* Language Switcher - Sağ üstte sabit */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher variant="default" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 py-20 sm:py-28">
        <div className="flex flex-col items-center text-center">
          {/* Logo/Brand */}
          <div className="mb-12 animate-fade-in">
            {/* Medical Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-teal-500 opacity-20 blur-3xl rounded-full"></div>
                <div className="relative h-20 w-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                  <Stethoscope className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-bold text-slate-800 mb-4">
              {t('home.heroTitle').split(' ')[0]} <span className="text-teal-600">{t('home.heroTitle').split(' ')[1]}</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              {t('home.heroSubtitle')}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/20 hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              {t('home.loginButton')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-teal-700 bg-white border-2 border-teal-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 shadow-md hover:shadow-lg transition-all duration-200"
            >
              {t('home.registerButton')}
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
            <div className="group flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-200 hover:border-slate-300 transition-all duration-300">
              <div className="p-4 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl mb-5 shadow-lg shadow-teal-500/20">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">
                {t('home.features.appointment.title')}
              </h3>
              <p className="text-base text-slate-500 text-center leading-relaxed">
                {t('home.features.appointment.description')}
              </p>
            </div>

            <div className="group flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-200 hover:border-slate-300 transition-all duration-300">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-5 shadow-lg shadow-blue-500/20">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">
                {t('home.features.time.title')}
              </h3>
              <p className="text-base text-slate-500 text-center leading-relaxed">
                {t('home.features.time.description')}
              </p>
            </div>

            <div className="group flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-200 hover:border-slate-300 transition-all duration-300">
              <div className="p-4 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl mb-5 shadow-lg shadow-violet-500/20">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">
                {t('home.features.patient.title')}
              </h3>
              <p className="text-base text-slate-500 text-center leading-relaxed">
                {t('home.features.patient.description')}
              </p>
            </div>

            <div className="group flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-200 hover:border-slate-300 transition-all duration-300">
              <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mb-5 shadow-lg shadow-orange-500/20">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">
                {t('home.features.security.title')}
              </h3>
              <p className="text-base text-slate-500 text-center leading-relaxed">
                {t('home.features.security.description')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badge Section */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-teal-50 to-white rounded-2xl border border-teal-200 shadow-sm p-8 sm:p-12">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="flex-shrink-0">
              <div className="h-16 w-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {t('home.trustBadge.title')}
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed">
                {t('home.trustBadge.description')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white/80 backdrop-blur-xl mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-base text-slate-500">
              {t('home.footer.copyright')}
            </p>
            <div className="flex items-center gap-2 text-slate-500">
              <Heart className="h-4 w-4 text-teal-600 fill-teal-600" />
              <span className="text-sm">{t('home.footer.madeFor')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
