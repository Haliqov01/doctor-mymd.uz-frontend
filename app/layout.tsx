import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  return (
    <html lang="uz" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
