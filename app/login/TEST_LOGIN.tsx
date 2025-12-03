// 🧪 TEST LOGIN FORMU
// Bu dosya sadece development için - production'da silinecek

/**
 * EN KOLAY TEST KULLANICILARI:
 * 
 * 1. Telefon: doctor  | Şifre: 123
 * 2. Telefon: test    | Şifre: test  
 * 3. Telefon: admin   | Şifre: admin
 * 
 * Mock API herhangi bir telefon + şifre kabul eder!
 * 
 * KAYIT için SMS Kodu: 123456
 */

export const TEST_CREDENTIALS = {
  easy: {
    phone: 'doctor',
    password: '123'
  },
  simple: {
    phone: 'test',
    password: 'test'
  },
  admin: {
    phone: 'admin',
    password: 'admin'
  },
  realistic: {
    phone: '+998901234567',
    password: 'Test1234'
  }
};

export const SMS_CODE = '123456';


