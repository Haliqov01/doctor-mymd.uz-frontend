# Ko'z Muoyenasi Hisobot Tizimi

## Umumiy ma'lumot

Bu sistem shifokorlarga ko'z muoyenasi hisobotlarini tez va oson yaratish imkonini beradi. Tizim A4 formatda chop etish uchun to'liq optimallashtirilgan.

## Xususiyatlar

### 1. To'liq Muoyena Formi
- Bemor ma'lumotlari
- Shikoyatlar va anamnez
- Har ikkala ko'z uchun alohida muoyena
- Anatomik muoyena (11 ta bo'lim)
- Vizual o'tkirlik va refraktsiya
- Qo'shimcha o'lchashlar (KIB, paximetriya, B-skan, va boshqalar)

### 2. Aqlli Tanlash Tizimi
Har bir muoyena bo'limi uchun:
- **Tanlash rejimi**: Oldindan tayyorlangan ta'riflardan tanlash
- **Yozish rejimi**: O'z ta'rifingizni yozish
- 100+ oldindan tayyorlangan tibbiy ta'rif

### 3. A4 Formati
- Professional tablo dizayni
- Chop etish uchun optimallashtirilgan
- Barcha muhim ma'lumotlar bir sahifada

### 4. Tezkor Nusxalash
O'ng ko'z ma'lumotlarini chap ko'zga bir tugma bilan nusxalash

## Ishlatish

### 1. Dashboard'dan kirish
```
Dashboard → Tezkor Harakatlar → Ko'z Muoyenasi Hisoboti
```

### 2. Formani to'ldirish

#### Bemor Ma'lumotlari
- F.I.Sh., manzil, tug'ilgan sanasi, jinsi

#### Shikoyatlar
- Bemorning asosiy shikoyatlari
- Kasallik tarixi (anamnez)
- Yondosh kasalliklar

#### Muoyena (Har iki ko'z uchun)

Har bir bo'lim uchun:
1. "Tanlash" tugmasini bosing → oldindan tayyorlangan variantlardan tanlang
2. "Yozish" tugmasini bosing → o'z ta'rifingizni yozing

**Muoyena bo'limlari:**
- Ko'z olmasi
- Ko'z mushaklari
- Qovoqlar va ko'z yosh yo'llari
- Konyunktiva
- Sklera
- Shox parda
- Old kamera va ko'z ichi suyuqligi
- Rangdor parda va qorachiq
- Gavhar
- Shishasimon tana
- Ko'z tubi

**O'lchashlar:**
- Ko'rish o'tkirligi (k/siz va k/bilan)
- Refraktsiya (sph, cyl, ax)
- KIB (Ko'z ichi bosimi)
- Ko'z o'lchami
- Shox parda qalinligi
- B-skan
- Gonioskopiya

#### Tashhis
- OU (Ikkala ko'z)
- OD (O'ng ko'z)
- OS (Chap ko'z)

#### Tavsiya
Davolash rejasi va tavsiyalar

### 3. Ko'rib chiqish
"Oldindan ko'rish" tugmasini bosing → to'liq hisobotni ko'ring

### 4. Chop etish
"Chop etish" tugmasini bosing → A4 formatda chop eting

## Oldindan tayyorlangan ta'riflar

### Konyunktiva
- Och pushti, yupqa, silliq, yaltiroq, ajralma yo'q (Normal)
- Qizarib ketgan, tomirlar kengaygan
- Shishib ketgan (xemoz)
- Sariq-oq ajralma bor
- Subkonyunktival qon quyilish
- va boshqalar...

### Shox parda
- Shaffof, yaltiroq, silliq, o'lchami normal (Normal)
- Shaffofroq xususiyati yo'qolgan
- Eroziya mavjud
- Yaralanish (yazva) mavjud
- Konussimon shakl (keratokonus)
- va boshqalar...

### Gavhar
- Shaffof (Normal)
- Nozik loyqaliklar (boshlanuvchi katarakt)
- Qisman loyqa (noetil katarakt)
- To'liq loyqa (etil katarakt)
- Sun'iy gavhar o'rnatilgan (psevdofakiya)
- va boshqalar...

### Ko'z tubi
- Ko'z tubi pushti, chegaralari aniq (Normal)
- Ko'z sinir diskining excavatsiyasi kengaygan (glaukoma)
- Diabetik retinopatiya belgilari
- Makula degeneratsiyasi
- Retina otkreshgan (dekolman)
- va boshqalar...

### Tashhislar
100+ ko'z kasalliklari:
- Miyopiya, Gipermetropiya, Astigmatizm
- Katarakt (turli xillari)
- Glaukoma
- Diabetik retinopatiya
- Retina kasalliklari
- Konyunktivit, Keratit, Uveit
- va boshqalar...

## Maslahatlar

1. **Tez to'ldirish**: Ko'pchilik bo'limlar normal qiymatlar bilan to'ldirilgan
2. **Nusxalash**: Agar ikkala ko'z ham bir xil bo'lsa, o'ng ko'zni to'ldiring va "O'ng ko'zdan chap ko'zga nusxalash" tugmasini bosing
3. **Aralash usul**: Oldindan tayyorlangan ta'rifni tanlab, keyin tahrirlash mumkin
4. **Oldindan ko'rish**: Chop etishdan oldin doimo oldindan ko'rib chiqing

## Texnik Ma'lumotlar

### Yaratilgan Fayllar:
```
types/report.ts                          - Tip ta'riflari
lib/examination-options.ts               - Ta'riflar bazasi
app/dashboard/reports/create/
  ├── page.tsx                          - Asosiy sahifa
  └── components/
      ├── ExaminationField.tsx          - Muoyena maydoni
      ├── PatientInfoSection.tsx        - Bemor ma'lumotlari
      └── ReportPrintTemplate.tsx       - Chop etish shabloni
```

### Texnologiyalar:
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Browser Print API

## Misol

**Normal Ko'z Muoyenasi:**
```
Ko'z olmasi: Normal holatda
Ko'z mushaklari: Faol, barcha tomonga harakat to'liq saqlangan
Konyunktiva: Och pushti, yupqa, silliq, yaltiroq, ajralma yo'q
Sklera: Oq rangda, tekis
Shox parda: Shaffof, yaltiroq, silliq, o'lchami normal
Old kamera: O'rta chuqurlikda, suyuqligi shaffof
Rangdor parda: Oddiy shaklda, qorachiq dumaloq, yorug'likka javob beradi
Gavhar: Shaffof
Shishasimon tana: Shaffof
Ko'z tubi: Ko'z tubi pushti, chegaralari aniq, tomirlar normal
Ko'rish o'tkirligi: k/siz 1.0, k/bilan 1.0
```

**Miyopiya bilan:**
```
Ko'rish o'tkirligi: k/siz 0.3, k/bilan 1.0
Refraktsiya: sph -2.5, cyl -0.5, ax 90°
Tashhis: OU Miyopiya o'rtacha darajali
Tavsiya: Ko'zoynak buyurildi. Nazorat muoyanasiga 1 yildan keyin.
```

## Xususiyatlar

- To'liq responsiv dizayn
- A4 format printga optimallashtirilgan
- 100+ oldindan tayyorlangan tibbiy ta'rif
- Tez to'ldirish va nusxalash
- Professional tibbiy hisobot dizayni
- Browser print va PDF export

## Kelajakda qo'shilishi mumkin

- Hisobotlarni saqlash (Database)
- Hisobotlar tarixi
- Bemor bilan bog'lash
- Rasm yuklash (fundus foto, va boshqalar)
- Dijital imzo
- PDF eksport
- Hisobot shablonlari
- Statistika va tahlil

## Yordam

Agar muammolar bo'lsa yoki takliflaringiz bo'lsa, iltimos admin bilan bog'laning.

---

**Yaratildi:** 2025
**Versiya:** 1.0.0
**Til:** O'zbek tili (Lotin)
