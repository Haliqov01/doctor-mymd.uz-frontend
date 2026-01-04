# Doctor MyMD

Zamonaviy va qulay shifokor uchrashuv boshqaruv tizimi.

## Xususiyatlar

- Foydalanuvchi autentifikatsiyasi (Kirish/Ro'yxatdan o'tish)
- Uchrashuvlarni boshqarish
- Shifokor profili boshqaruvi
- Klinika boshqaruvi
- Boshqaruv paneli va statistika
- Bildirishnoma tizimi
- Responsive dizayn

## Texnologiyalar

- **Framework:** Next.js 16 (App Router)
- **Stil:** Tailwind CSS v4
- **UI Kutubxonasi:** Radix UI + shadcn/ui
- **Form Boshqaruvi:** React Hook Form + Zod
- **Ikonlar:** Lucide React
- **Fayl Yuklash:** UploadThing
- **State Boshqaruvi:** React Hooks
- **Mavzu:** next-themes

## O'rnatish

1. Bog'liqliklarni o'rnating:

```bash
npm install
```

2. `.env.local` faylini yarating:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

3. Ishlab chiqish serverini ishga tushiring:

```bash
npm run dev
```

4. Brauzeringizda [http://localhost:3002](http://localhost:3002) manzilini oching.

## Loyiha Tuzilmasi

```
doctor-mymd/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Boshqaruv paneli sahifalari
│   ├── login/             # Kirish sahifasi
│   ├── register/          # Ro'yxatdan o'tish sahifasi
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Asosiy sahifa
├── components/            # React komponentlar
│   └── ui/               # shadcn/ui komponentlar
├── lib/                   # Yordamchi funksiyalar
│   ├── utils.ts          # Utility funksiyalar
│   └── api-client.ts     # API mijozi
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript tip ta'riflari
└── proxy.ts               # Next.js 16 Proxy (Auth)
```

## Autentifikatsiya

Ilova Next.js 16 proxy yordamida avtomatik autentifikatsiya tekshiruvi amalga oshiradi:
- Autentifikatsiya qilinmagan foydalanuvchilar `/login` sahifasiga yo'naltiriladi
- Kirgan foydalanuvchilar `/dashboard` sahifasiga yo'naltiriladi
- Token cookie sifatida saqlanadi

## UI Komponentlar

Loyiha shadcn/ui ishlatadi. Yangi komponent qo'shish uchun:

```bash
npx shadcn@latest add [component-name]
```

## Buyruqlar

```bash
# Ishlab chiqish serveri
npm run dev

# Production build
npm run build

# Production serveri
npm run start

# Linting
npm run lint
```

## API Integratsiyasi

API so'rovlari uchun `lib/api-client.ts` ichidagi `apiClient` ishlatiladi:

```typescript
import { apiClient } from "@/lib/api-client";

// GET so'rovi
const data = await apiClient.get("/endpoint", { token });

// POST so'rovi
const result = await apiClient.post("/endpoint", { data }, { token });
```

## Litsenziya

Bu loyiha maxsus loyihadir.

## Aloqa

Savollaringiz uchun biz bilan bog'laning.
