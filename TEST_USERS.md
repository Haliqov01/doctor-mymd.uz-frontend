# TEST FOYDALANUVCHILARI

## Login Ma'lumotlari (OSON)

Mock API'da **har qanday telefon + parol** qabul qilinadi. 
Lekin qulaylik uchun quyidagi test foydalanuvchilaridan foydalanishingiz mumkin:

---

### TEST FOYDALANUVCHI 1 (Tavsiya qilingan)

```
Telefon: doctor
Parol:   123
```

**yoki**

```
Telefon: test
Parol:   test
```

**yoki**

```
Telefon: admin
Parol:   admin
```

---

### TEST FOYDALANUVCHI 2 (O'zbekcha)

```
Telefon: doktor
Parol:   12345
```

---

### TEST FOYDALANUVCHI 3 (Haqiqiy)

```
Telefon: +998901234567
Parol:   Test1234
```

---

## TEZKOR KIRISH QADAMLARI

1. **http://localhost:3002/login** manziliga o'ting
2. Telefon: `doctor`
3. Parol: `123`
4. "Kirish" tugmasini bosing
5. Avtomatik ravishda `/dashboard` sahifasiga yo'naltirilasiz

---

## KIRGANINGIZDAN KEYIN KO'RASIZ

Kirganingizdan keyin mock foydalanuvchi ma'lumotlari:

- **Ism:** Aziz Karimov
- **Rol:** DOCTOR (Shifokor)
- **Mutaxassislik:** Kardiolog
- **Litsenziya:** MD-123456 (Tasdiqlangan)
- **Email:** doctor@mymd.uz
- **Telefon:** +998901234567

---

## RO'YXATDAN O'TISH (REGISTER) UCHUN

**SMS Kodi:** `123456` (Har doim shu)

Ro'yxatdan o'tish formasida:
1. Har qanday telefon raqamini kiriting
2. "SMS kod yuborish" tugmasini bosing
3. Kod sifatida: **123456** kiriting
4. Davom eting

---

## MUAMMO YECHISH

Agar hali ham kirish imkoni bo'lmasa:

1. Console'ni oching (F12)
2. Network tab'iga qarang
3. `/api/auth/login` so'roviga bosing
4. Response'ni tekshiring

Console'da ko'rish uchun:
```javascript
fetch('http://localhost:3002/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phoneNumber: 'doctor', password: '123' })
}).then(r => r.json()).then(console.log)
```

---

## ENG OSON USULI

**Telefon:** `test`  
**Parol:** `test`

Shunchaki shu!
