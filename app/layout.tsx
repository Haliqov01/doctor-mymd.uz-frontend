import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MyMD.uz - Tibbiy Yordamchi Platformasi",
    template: "%s | MyMD.uz",
  },
  description:
    "Bemor va shifokor o'rtasida xavfsiz uchrashuv va hujjat almashish imkonini beruvchi tibbiy platforma",
  keywords: [
    "salomatlik",
    "shifokor",
    "bemor",
    "uchrashuv",
    "hujjat almashish",
    "tibbiy yozuvlar",
    "onlayn salomatlik",
  ],
  authors: [{ name: "MyMD.uz Team" }],
  creator: "MyMD.uz",
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    url: "https://mymd.uz",
    title: "MyMD.uz - Tibbiy Yordamchi Platformasi",
    description:
      "Bemor va shifokor o'rtasida xavfsiz uchrashuv va hujjat almashish imkonini beruvchi tibbiy platforma",
    siteName: "MyMD.uz",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Root layout sadece children döndürür
  // html ve body tag'leri [locale]/layout.tsx'te
  return children;
}
