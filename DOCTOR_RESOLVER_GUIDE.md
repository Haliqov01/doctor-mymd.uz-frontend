# DoctorResolver Xizmati - Amalga Oshirish Qo'llanmasi

## Umumiy Ma'lumot

`DoctorResolver` xizmati backend `GetProfile` API `userId` qaytargan, lekin barcha shifokorga xos operatsiyalar uchun `doctorId` kerak bo'lgan muhim arxitektura bo'shligini hal qiladi.

---

## Qanday Ishlaydi

### Muammo
```typescript
// Logindan keyin
const profile = await getProfile();
// profile = { id: 22, firstName: "Laziz", ... }
// doctorId yo'q!

// Lekin bizga doctorId kerak:
await getAppointments({ doctorId: ??? });
```

### Yechim
```typescript
// Avtomatik aniqlash
const doctorId = await doctorResolver.resolve();
// doctorId = 10

// Endi ishlatish mumkin:
await getAppointments({ doctorId: 10 });
```

---

## Tezkor Boshlash

### 1-Qadam: Ilovangizni O'rang

```tsx
// app/layout.tsx yoki app/[locale]/dashboard/layout.tsx
import { DoctorProvider } from "@/lib/contexts/DoctorContext";

export default function DashboardLayout({ children }) {
  return (
    <DoctorProvider>
      {children}
    </DoctorProvider>
  );
}
```

### 2-Qadam: Hook'dan Foydalaning

```tsx
// Har qanday komponent
import { useDoctorId } from "@/lib/contexts/DoctorContext";

export default function AppointmentsPage() {
  const { doctorId, isLoading, error } = useDoctorId();

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error} />;
  if (!doctorId) return <NotAuthorized />;

  // doctorId bilan uchrashuvlarni olish
  const appointments = await getAppointments({ doctorId });

  return <AppointmentsList appointments={appointments} />;
}
```

---

## Aqlli Keshlash Mantigi

### Kesh Tuzilmasi
```typescript
{
  userId: 22,      // Kirgan foydalanuvchi
  doctorId: 10,    // Aniqlangan shifokor ID
  timestamp: 1234  // Kesh yaratilgan vaqt
}
```

### Kesh Tekshirish Oqimi
```
1. Foydalanuvchi kiradi (userId: 22)
2. DoctorResolver.resolve() chaqiriladi
3. Keshni tekshirish:
   - Kesh mavjud && userId mos → Keshlangan doctorId qaytarish
   - Kesh mavjud && userId boshqa → Keshni tozalash, yangisini olish
   - Kesh yo'q → Olish va keshlash
```

### Misol: Ko'p Foydalanuvchi Xavfsizligi

```typescript
// A foydalanuvchisi kiradi
await resolve(); // userId: 22 → doctorId: 10 aniqlanadi, keshlanadi

// B foydalanuvchisi kiradi (boshqa qurilma/sessiya)
await resolve(); // userId: 25 aniqlaydi, keshni tozalaydi → doctorId: 15

// A foydalanuvchisi qaytadi
await resolve(); // Kesh yaroqsiz (userId mos emas), qayta aniqlanadi
```

---

## Aniqlash Strategiyasi (Ko'prik)

Kesh yaroqsiz/yo'q bo'lganda, resolver:

```typescript
1. Profilni olish → { id: 22, firstName: "Laziz", lastName: "Rahmonov" }

2. Ism bo'yicha shifokorlarni qidirish
   POST /api/v1/Doctor/GetDoctors
   { fullName: "Laziz Rahmonov" }
   → Qaytaradi: [{ id: 10, ... }, { id: 15, ... }]

3. Har bir nomzodni tekshirish
   GET /api/v1/Doctor/GetDoctorById?doctorId=10
   → Qaytaradi: { id: 10, userId: 22 } MOS!

4. Keshlash va qaytarish
   doctorId = 10
```

---

## API Ma'lumotnomasi

### DoctorResolver.resolve()
```typescript
const doctorId = await doctorResolver.resolve();
// Qaytaradi: number | null
```
**Tavsif:** Asosiy usul. doctorId'ni keshlash bilan aniqlaydi.

**Qaytaradi:** 
- `number`: Aniqlangan shifokor ID
- `null`: Topilmadi yoki xato

---

### DoctorResolver.clear()
```typescript
doctorResolver.clear();
```
**Tavsif:** Keshni tozalaydi. Logout vaqtida chaqiring.

**Foydalanish:**
```typescript
// Logout handlerda
await authService.logout();
doctorResolver.clear(); // ← Resolver keshini tozalash
localStorage.clear();
router.push("/login");
```

---

### DoctorResolver.getCachedDoctorId()
```typescript
const doctorId = doctorResolver.getCachedDoctorId();
// Qaytaradi: number | null (sinxron)
```
**Tavsif:** Keshlangan ID'ga tezkor sinxron kirish.

**Foydalanish:** Kesh yaroqli ekanligiga ishonchingiz komil bo'lsa va darhol kirish kerak bo'lganda.

---

## Integratsiya Misollari

### Misol 1: Dashboard Statistikasi

```tsx
// app/dashboard/page.tsx
import { useDoctorId } from "@/lib/contexts/DoctorContext";

export default function Dashboard() {
  const { doctorId, isLoading } = useDoctorId();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!doctorId) return;

    async function fetchStats() {
      // Endi bizda doctorId bor!
      const appointments = await getAppointments({ doctorId });
      const patients = await getPatients({ doctorId });
      
      setStats({
        pendingAppointments: appointments.filter(a => a.status === "Pending").length,
        totalPatients: patients.totalCount,
      });
    }

    fetchStats();
  }, [doctorId]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <h1>Dashboard</h1>
      <StatsCard stats={stats} />
    </div>
  );
}
```

### Misol 2: Uchrashuvlar Sahifasi

```tsx
// app/dashboard/appointments/page.tsx
import { useDoctorId } from "@/lib/contexts/DoctorContext";

export default function AppointmentsPage() {
  const { doctorId } = useDoctorId();

  const fetchAppointments = useCallback(async () => {
    if (!doctorId) {
      console.warn("doctorId mavjud emas");
      return;
    }

    const result = await appointmentService.getAppointments({
      pageNumber: 1,
      pageSize: 100,
      doctorId: doctorId, // Avtomatik filtrlash!
    });

    setAppointments(result.data);
  }, [doctorId]);

  // ... komponentning qolgan qismi
}
```

### Misol 3: To'g'ridan-to'g'ri Xizmat Foydalanishi (Contextsiz)

```typescript
// doctorId kerak bo'lgan har qanday joyda
import { doctorResolver } from "@/lib/services/doctorResolver";

async function myFunction() {
  const doctorId = await doctorResolver.resolve();
  
  if (!doctorId) {
    throw new Error("Shifokor ID topilmadi");
  }

  // doctorId'dan foydalanish
  const data = await someService.getData({ doctorId });
  return data;
}
```

---

## Muhim Eslatmalar

### 1. Xatolarni Boshqarish
```typescript
const { doctorId, error } = useDoctorId();

if (error) {
  // Xatoni to'g'ri boshqarish
  return <ErrorBoundary message="Shifokor profilini yuklab bo'lmadi" />;
}
```

### 2. Logout Tozalash
```typescript
// DOIMO logoutda tozalang
const handleLogout = async () => {
  await authService.logout();
  doctorResolver.clear(); // ← Muhim!
  localStorage.clear();
  router.push("/login");
};
```

### 3. Ishlash
- Birinchi chaqiruv: ~1-2 soniya (API olish + keshlash)
- Keyingi chaqiruvlar: <10ms (kesh hit)
- Kesh TTL: 24 soat

### 4. Tab'lar Orasida Sinxronizatsiya
`DoctorProvider` `storage` hodisalarini tinglaydi, shuning uchun agar foydalanuvchi boshqa tab'da chiqsa, resolver avtomatik yangilanadi.

---

## Nosozliklarni Tuzatish

### Batafsil Loglarni Yoqish
Barcha resolver loglari `[DoctorResolver]` prefiksi bilan:

```
[DoctorResolver] userId: 22 uchun aniqlash
[DoctorResolver] Kesh hit! DoctorId: 10
[DoctorResolver] Ism bilan shifokorlarni qidirish: Laziz Rahmonov
[DoctorResolver] 2 ta nomzod topildi
[DoctorResolver] Mos keldi! DoctorId: 10
```

### Keshni Tekshirish
```typescript
// Brauzer konsolida
const cache = JSON.parse(localStorage.getItem("doctor_id_cache"));
console.log(cache);
// { userId: 22, doctorId: 10, timestamp: 1704310234567 }
```

### Majburiy Qayta Aniqlash
```typescript
// React komponentda
const { refetch } = useDoctorId();
await refetch(); // Yangi aniqlashga majbur qiladi
```

---

## Backend Buni Tuzatganda

Backend `GetProfile` javobiga `doctorId` qo'shganda:

### Variant A: Resolverni Yangilash (Tavsiya qilingan)
```typescript
// doctorResolver.ts ichida
static async resolve(): Promise<number | null> {
  const profile = await authService.getProfile();
  
  // Backend endi doctorId qaytarishini tekshirish
  if (profile.doctorId) {
    return profile.doctorId;
  }
  
  // Joriy mantiqqa qaytish
  // ... (mavjud kod)
}
```

### Variant B: Resolverni Butunlay Olib Tashlash
```typescript
// Shunchaki profile.doctorId'dan to'g'ridan-to'g'ri foydalaning
const profile = await authService.getProfile();
const doctorId = profile.doctorId;
```

---

## Test Ro'yxati

- Shifokor sifatida kirish → doctorId aniqlandi
- Logout → kesh tozalandi
- Boshqa shifokor sifatida kirish → yangi doctorId keshlandi
- Uchrashuvlar doctorId bo'yicha to'g'ri filtrlangan
- Dashboard statistikasi faqat shu shifokorning ma'lumotlarini ko'rsatadi
- Tab'lar orasida logout keshni tozalaydi
- Ism bo'yicha qidiruv to'g'ri shifokorni topadi
- Ko'p nomzodni moslashtirish ishlaydi (bir xil ism, turli foydalanuvchilar)

---

**Yaratildi:** Frontend Jamoasi  
**Oxirgi Yangilangan:** 2026-01-03  
**Holat:** Production Ready
