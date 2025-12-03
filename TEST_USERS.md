# 🧪 TEST KULLANICILARI

## 🔐 Login Bilgileri (KOLAY)

Mock API'de **herhangi bir telefon + şifre** kabul edilir. 
Ama kolaylık için aşağıdaki test kullanıcılarını kullanabilirsiniz:

---

### ✅ TEST KULLANICI 1 (Önerilen)

```
Telefon: doctor
Şifre:   123
```

**veya**

```
Telefon: test
Şifre:   test
```

**veya**

```
Telefon: admin
Şifre:   admin
```

---

### ✅ TEST KULLANICI 2 (Uzbekça)

```
Telefon: doktor
Şifre:   12345
```

---

### ✅ TEST KULLANICI 3 (Gerçekçi)

```
Telefon: +998901234567
Şifre:   Test1234
```

---

## 📋 HIZLI GİRİŞ ADIMLARI

1. **http://localhost:3002/login** adresine gidin
2. Telefon: `doctor`
3. Şifre: `123`
4. "Kirish" butonuna tıklayın
5. ✅ Otomatik olarak `/dashboard` sayfasına yönlendirileceksiniz

---

## 👤 GİRİŞ YAPINCA GÖRECEKLER

Giriş yapınca mock kullanıcı bilgileri:

- **İsim:** Aziz Karimov
- **Rol:** DOCTOR (Doktor)
- **Uzmanlık:** Kardiolog
- **Lisans:** MD-123456 ✅ (Doğrulanmış)
- **Email:** doctor@mymd.uz
- **Telefon:** +998901234567

---

## 📱 KAYIT (REGISTER) İÇİN

**SMS Kodu:** `123456` (Her zaman bu)

Kayıt formunda:
1. Herhangi bir telefon numarası girin
2. "SMS kod yuborish" tıklayın
3. Kod olarak: **123456** girin
4. Devam edin

---

## 🎯 SORUN ÇÖZME

Eğer hala giriş yapamazsanız:

1. Console'u açın (F12)
2. Network tab'ına bakın
3. `/api/auth/login` isteğine tıklayın
4. Response'u kontrol edin

Console'da görmek isterseniz:
```javascript
fetch('http://localhost:3002/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phoneNumber: 'doctor', password: '123' })
}).then(r => r.json()).then(console.log)
```

---

## ✅ EN KOLAY YÖNTEMİ

**Telefon:** `test`  
**Şifre:** `test`

Sadece bu kadar! 🎉


