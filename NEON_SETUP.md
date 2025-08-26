# Neon PostgreSQL Setup Guide

## 🎯 Redis'ten Neon'a Geçiş Tamamlandı!

### ✅ Yapılan Değişiklikler:

1. **@neondatabase/serverless** paketi eklendi
2. **database-neon.ts** dosyası oluşturuldu (PostgreSQL implementation)
3. **database.ts** dosyası güncellendi (Neon'u kullanacak şekilde)
4. **env-validation.ts** DATABASE_URL kullanacak şekilde güncellendi
5. **.env.example** dosyası Neon için güncellendi

## 🚀 Neon Database Kurulumu

### 1. **Neon Account Oluşturun**
- https://neon.tech adresine gidin
- Ücretsiz hesap oluşturun
- Yeni bir proje oluşturun

### 2. **Database Connection String Alın**
Neon Dashboard'dan connection string'i kopyalayın:
```
postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### 3. **Environment Variables Ekleyin**

`.env.local` dosyanıza ekleyin:
```bash
# Neon PostgreSQL Database
DATABASE_URL=postgresql://username:password@ep-example-123456.us-east-1.aws.neon.tech/neondb?sslmode=require

# Diğer gerekli variables
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_nextauth_key_min_32_characters
JWT_SECRET=4196077a12a2f37b080faeb82b123fcc0c05bad09d1264c94369ee0888e22854
FAL_KEY=your_fal_api_key_here
```

### 4. **Vercel'de Production Deployment**

Vercel Dashboard → Settings → Environment Variables:
```
DATABASE_URL=your_neon_connection_string_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret
JWT_SECRET=your_jwt_secret
FAL_KEY=your_fal_api_key
```

## 🔧 Teknik Detaylar

### **Neon Database Özellikleri:**
- ✅ **Serverless PostgreSQL** - otomatik scaling
- ✅ **Persistent Storage** - veri asla kaybolmaz  
- ✅ **Fast Queries** - optimized PostgreSQL performance
- ✅ **Free Tier** - 0.5GB storage, 10 hours compute
- ✅ **Vercel Integration** - mükemmel uyumluluk

### **Veritabanı Tabloları:**
Neon'da otomatik olarak oluşturulacak tablolar:

```sql
-- users tablosu
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  auth_type VARCHAR(50) NOT NULL DEFAULT 'email',
  credits INTEGER DEFAULT 10,
  total_generated INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- transactions tablosu  
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  amount INTEGER NOT NULL,
  description TEXT,
  stripe_payment_intent_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- credit_packages tablosu
CREATE TABLE credit_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  credits INTEGER NOT NULL,
  price_usd DECIMAL(10,2) NOT NULL,
  stripe_price_id VARCHAR(255),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🐛 Sorun Giderme

### **"Access Denied" Hatası İçin:**

1. **Google Cloud Console'da redirect URI kontrol edin:**
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-app-name.vercel.app/api/auth/callback/google
   ```

2. **Environment variables kontrol edin:**
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET  
   - NEXTAUTH_URL
   - NEXTAUTH_SECRET

3. **Browser cache temizleyin:**
   - Ctrl + Shift + R (hard refresh)
   - Incognito mode'da test edin

### **Database Connection Hataları:**
- DATABASE_URL formatını kontrol edin
- Neon dashboard'da database'in aktif olduğunu kontrol edin
- SSL connection gerekli (`?sslmode=require`)

## 🎉 Test Edin

1. Development server'ı başlatın:
   ```bash
   npm run dev
   ```

2. http://localhost:3000 açın

3. "Google ile Giriş Yap" butonunu test edin

4. Console'da şu mesajı görmelisiniz:
   ```
   ✅ Using Neon PostgreSQL database
   ```

## 📈 Neon vs Redis Avantajları

| Özellik | Redis KV | Neon PostgreSQL |
|---------|----------|-----------------|
| **Veri Tipi** | Key-Value | Relational SQL |
| **Queries** | Basit | Complex SQL |
| **Relations** | Yok | Foreign Keys |
| **Scaling** | Manuel | Otomatik |
| **Cost** | Ücretli | Free tier |
| **Backup** | Manuel | Otomatik |
| **ACID** | Kısıtlı | Tam ACID |

Neon PostgreSQL, daha güçlü, esnek ve ücretsiz bir çözüm sunuyor! 🚀