# 🔗 Backend Entegrasyonu

## 📋 Mevcut Durum

Frontend artık gerçek backend API'lerine bağlanmaya hazır!

### ✅ Tamamlanan İşler

1. **API Client** - Backend formatına uyumlu hale getirildi (`lib/api-client.ts`)
2. **Service Katmanı** - Tüm API çağrıları için servisler oluşturuldu:
   - `lib/services/auth.service.ts` - Kimlik doğrulama
   - `lib/services/appointment.service.ts` - Randevu yönetimi
   - `lib/services/doctor.service.ts` - Doktor işlemleri
   - `lib/services/patient.service.ts` - Hasta işlemleri
   - `lib/services/report.service.ts` - Rapor işlemleri

3. **Sayfalar** - Gerçek API'lere bağlandı:
   - `/login` - Giriş sayfası
   - `/dashboard` - Ana panel
   - `/dashboard/appointments` - Randevular
   - `/dashboard/profile` - Profil

4. **Token Yönetimi** - JWT token localStorage'da saklanıyor

---

## 🚀 Başlatma

### 1. Environment Ayarları

`.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 2. Frontend'i Başlatın

```bash
npm run dev
```

### 3. Backend'i Başlatın

Backend projesini `http://localhost:5000` portunda çalıştırın.

---

## 📡 API Endpoint Eşleştirmesi

### Kimlik Doğrulama

| Frontend | Backend Endpoint |
|----------|-----------------|
| Login | `POST /api/v1/Authorization/SignIn` |
| Register | `POST /api/v1/Authorization/SignUp` |
| Get Profile | `GET /api/v1/Authorization/GetProfile/profile` |
| Update Profile | `PUT /api/v1/Authorization/UpdateProfile/profile` |

### Randevular

| Frontend | Backend Endpoint |
|----------|-----------------|
| List | `POST /api/v1/Appointment/GetAppointments` |
| Get One | `GET /api/v1/Appointment/GetAppointmentById?appointmentId=X` |
| Create/Update | `POST /api/v1/Appointment/UpsertAppointment` |
| Update Status | `POST /api/v1/Appointment/UpdateAppointmentStatus` |
| Cancel | `POST /api/v1/Appointment/CancelAppointment?appointmentId=X` |

### Doktor

| Frontend | Backend Endpoint |
|----------|-----------------|
| List | `POST /api/v1/Doctor/GetDoctors` |
| Get One | `GET /api/v1/Doctor/GetDoctorById?doctorId=X` |
| Upload Certificate | `POST /api/v1/Doctor/UploadCertificate/upload-certificate` |
| Get Certificates | `GET /api/v1/Doctor/GetCertificates/certificates?doctorId=X` |

### Hasta

| Frontend | Backend Endpoint |
|----------|-----------------|
| List | `POST /api/v1/Patient/GetPatients` |
| Get One | `GET /api/v1/Patient/GetPatientById?patientId=X` |

---

## ⚠️ Backend'de Eklenmesi Gereken Endpoint'ler

### 1. Çalışma Saatleri (YENİ TABLO + ENDPOINT GEREKLİ)

```
GET  /api/v1/Doctor/GetWorkingHours?doctorId=X
POST /api/v1/Doctor/SaveWorkingHours
```

**WorkingHours Entity:**
```csharp
public class WorkingHour
{
    public long Id { get; set; }
    public long DoctorId { get; set; }
    public string DayOfWeek { get; set; } // MONDAY, TUESDAY, etc.
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public TimeSpan? BreakStart { get; set; }
    public TimeSpan? BreakEnd { get; set; }
    public bool IsActive { get; set; }
}
```

### 2. Doktor Profil Tamamlama

```
POST /api/v1/Doctor/CompleteProfile
```

### 3. Hasta Sayısı (İstatistik)

```
GET /api/v1/Patient/GetPatientCountByDoctor?doctorId=X
```

### 4. Randevu İstatistikleri

```
GET /api/v1/Appointment/GetStatsByDoctor?doctorId=X
```

---

## 🔐 CORS Ayarları

Backend'de CORS yapılandırması eklenmeli:

```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("DoctorFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "http://localhost:3002"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// app.UseCors("DoctorFrontend"); 
```

---

## 📊 API Response Formatı

Backend şu formatta response dönmeli:

```json
{
  "payload": { ... },
  "success": true,
  "error": {
    "code": "string",
    "message": "string",
    "details": null
  }
}
```

Frontend bu formatı otomatik parse ediyor (`lib/api-client.ts`).

---

## 🧪 Test

1. Backend'i başlatın
2. Frontend'i başlatın
3. `/login` sayfasına gidin
4. Kayıtlı bir kullanıcı ile giriş yapın
5. Dashboard'da verilerin geldiğini kontrol edin

---

## 📝 Notlar

- Token `localStorage`'da `auth_token` key'i ile saklanıyor
- 401 hataları otomatik olarak login sayfasına yönlendiriyor
- Tüm API çağrıları `Bearer {token}` header'ı ile gönderiliyor

