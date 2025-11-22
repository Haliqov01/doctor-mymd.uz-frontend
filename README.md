# Doctor MyMD

Modern, kullanıcı dostu bir doktor randevu yönetim sistemi.

## 🚀 Özellikler

- 👤 Kullanıcı kimlik doğrulama (Giriş/Kayıt)
- 📅 Randevu yönetimi
- 👨‍⚕️ Doktor profil yönetimi
- 🏥 Klinik yönetimi
- 📊 Dashboard ve istatistikler
- 🔔 Bildirim sistemi
- 📱 Responsive tasarım
- 🌙 Dark mode desteği

## 🛠️ Teknolojiler

- **Framework:** Next.js 16 (App Router)
- **Stil:** Tailwind CSS v4
- **UI Kütüphanesi:** Radix UI + shadcn/ui
- **Form Yönetimi:** React Hook Form + Zod
- **İkonlar:** Lucide React
- **Dosya Yükleme:** UploadThing
- **State Yönetimi:** React Hooks
- **Tema:** next-themes

## 📦 Kurulum

1. Bağımlılıkları yükleyin:

```bash
npm install
```

2. `.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

3. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

4. Tarayıcınızda [http://localhost:3002](http://localhost:3002) adresini açın.

## 📂 Proje Yapısı

```
doctor-mymd/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard sayfaları
│   ├── login/             # Giriş sayfası
│   ├── register/          # Kayıt sayfası
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Ana sayfa
├── components/            # React bileşenleri
│   └── ui/               # shadcn/ui bileşenleri
├── lib/                   # Yardımcı fonksiyonlar
│   ├── utils.ts          # Utility fonksiyonları
│   └── api-client.ts     # API istemcisi
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript tip tanımları
└── proxy.ts               # Next.js 16 Proxy (Auth - eski middleware)
```

## 🔐 Kimlik Doğrulama

Uygulama, Next.js 16 proxy kullanarak otomatik kimlik doğrulama kontrolü yapar:
- Kimliği doğrulanmamış kullanıcılar `/login` sayfasına yönlendirilir
- Giriş yapmış kullanıcılar `/dashboard` sayfasına yönlendirilir
- Token, cookie olarak saklanır
- **Not:** Next.js 16'da `middleware.ts` deprecated edildi, `proxy.ts` kullanılıyor

## 🎨 UI Bileşenleri

Proje shadcn/ui kullanır. Yeni bileşen eklemek için:

```bash
npx shadcn@latest add [component-name]
```

## 📝 Komutlar

```bash
# Geliştirme sunucusu
npm run dev

# Production build
npm run build

# Production sunucusu
npm run start

# Linting
npm run lint
```

## 🌐 API Entegrasyonu

API çağrıları için `lib/api-client.ts` içindeki `apiClient` kullanılır:

```typescript
import { apiClient } from "@/lib/api-client";

// GET isteği
const data = await apiClient.get("/endpoint", { token });

// POST isteği
const result = await apiClient.post("/endpoint", { data }, { token });
```

## 🤝 Katkıda Bulunma

1. Bu repoyu fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje özel bir projedir.

## 📧 İletişim

Sorularınız için lütfen bizimle iletişime geçin.
