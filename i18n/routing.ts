import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // Qo'llab-quvvatlanadigan tillar
  locales: ['uz', 'ru'],
  
  // Standart til
  defaultLocale: 'uz',
  
  // Brauzer tilini avtomatik aniqlash
  localeDetection: true,
  
  // Standart til uchun URL'da prefix ko'rsatmaslik
  // '/' o'rniga '/uz' ko'rsatmaydi
  localePrefix: 'as-needed'
});

// Navigation yordamchilari - i18n mos Link, useRouter, usePathname, redirect
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);






