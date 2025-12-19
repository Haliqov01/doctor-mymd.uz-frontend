import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // Desteklenen diller
  locales: ['uz', 'ru'],
  
  // Varsayılan dil
  defaultLocale: 'uz',
  
  // Tarayıcı dilini otomatik algıla
  localeDetection: true,
  
  // Varsayılan dil için URL'de prefix gösterme
  // '/' yerine '/uz' göstermez
  localePrefix: 'as-needed'
});

// Navigation helpers - i18n uyumlu Link, useRouter, usePathname, redirect
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);



