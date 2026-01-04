import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Middleware tarafından sağlanan locale
  let locale = await requestLocale;

  // Locale yoksa veya desteklenmiyorsa varsayılan kullan
  if (!locale || !routing.locales.includes(locale as typeof routing.locales[number])) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    // Çeviri dosyasını dinamik yükle
    messages: (await import(`../messages/${locale}.json`)).default
  };
});






