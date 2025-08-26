# Google OAuth Sorun Giderme Rehberi

## ✅ Çözüm Uygulandı
- Content Security Policy (CSP) middleware'i eklendi
- Çok izin verici bir CSP yapılandırması ile Google OAuth desteklendi

## 🔧 Yapmanız Gerekenler

### 1. Google Cloud Console Ayarları

**Adım 1: Google Cloud Console'a gidin**
- https://console.cloud.google.com/
- APIs & Services → Credentials

**Adım 2: OAuth 2.0 Client ID'nizi düzenleyin**

**Authorized JavaScript origins ekleyin:**
```
http://localhost:3000
https://your-app-name.vercel.app
```

**Authorized redirect URIs ekleyin:**
```
http://localhost:3000/api/auth/callback/google
https://your-app-name.vercel.app/api/auth/callback/google
```

### 2. Environment Variables Kontrolü

`.env.local` dosyanızda şu değişkenlerin olduğundan emin olun:

```bash
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_nextauth_key_min_32_characters
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
FAL_KEY=your_fal_api_key_here
```

### 3. Development Server'ı Yeniden Başlatın

```bash
npm run dev
```

### 4. Test Edin
- http://localhost:3000 adresine gidin
- "Google ile Giriş Yap" butonuna tıklayın
- Artık CSP hatası almamalısınız

## 🚨 Hala Sorun Yaşıyorsanız

### A. "Access Denied" Hatası
- Google Cloud Console'da redirect URI'ların doğru olduğundan emin olun
- GOOGLE_CLIENT_ID ve GOOGLE_CLIENT_SECRET değerlerini kontrol edin

### B. "Invalid Client" Hatası
- Environment variables'ların doğru kopyalandığından emin olun
- Başında/sonunda boşluk olmadığından emin olun

### C. Hala CSP Hatası Alıyorsanız
Middleware dosyasındaki CSP'yi tamamen devre dışı bırakabilirsiniz:

```typescript
// middleware.ts içinde bu satırı yorum haline getirin:
// response.headers.set('Content-Security-Policy', csp)
```

## 📋 Kontrol Listesi

- [ ] Google Cloud Console'da doğru redirect URI'lar var
- [ ] Environment variables doğru ayarlanmış
- [ ] Development server yeniden başlatıldı  
- [ ] CSP middleware'i eklenmiş
- [ ] Google OAuth credentials güncel

## 🎯 Sonuç
Bu adımları takip ettikten sonra Google OAuth giriş sisteminiz sorunsuz çalışmalıdır.