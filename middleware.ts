import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

// next-intl middleware'i
const intlMiddleware = createMiddleware(routing);

// Public route'lar (auth gerektirmeyen)
const publicRoutes = ["/", "/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static dosyaları atla
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Önce i18n middleware'i çalıştır (dil algılama + yönlendirme)
  const response = intlMiddleware(request);

  // === AUTH KONTROLÜ ===
  // Locale prefix'ini pathname'den çıkar
  const localeMatch = pathname.match(/^\/(uz|ru)/);
  const locale = localeMatch?.[1] || routing.defaultLocale;
  const pathWithoutLocale = localeMatch
    ? pathname.replace(/^\/(uz|ru)/, "") || "/"
    : pathname;

  // Public route kontrolü
  const isPublicRoute = publicRoutes.some((route) => {
    if (route === "/") return pathWithoutLocale === "/";
    return pathWithoutLocale.startsWith(route);
  });

  // Ana sayfa - login'e yönlendir (token yoksa)
  if (pathWithoutLocale === "/") {
    const token = request.cookies.get("token")?.value;
    if (token) {
      const dashboardUrl = new URL(
        locale === routing.defaultLocale ? "/dashboard" : `/${locale}/dashboard`,
        request.url
      );
      return NextResponse.redirect(dashboardUrl);
    }
    const loginUrl = new URL(
      locale === routing.defaultLocale ? "/login" : `/${locale}/login`,
      request.url
    );
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicRoute) {
    // Token varsa ve public path'e gidiyorsa, dashboard'a yönlendir
    const token = request.cookies.get("token")?.value;
    if (token) {
      // Eger allaqachon dashboardda bo'lsa, redirect qilmaslik kerak (loop oldini olish)
      if (pathWithoutLocale.startsWith("/dashboard")) {
        return response;
      }

      const dashboardUrl = new URL(
        locale === routing.defaultLocale ? "/dashboard" : `/${locale}/dashboard`,
        request.url
      );
      return NextResponse.redirect(dashboardUrl);
    }
    return response;
  }

  // Auth token kontrolü - protected routes için
  const token = request.cookies.get("token")?.value;
  if (!token) {
    const loginUrl = new URL(
      locale === routing.defaultLocale ? "/login" : `/${locale}/login`,
      request.url
    );
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)"],
};
