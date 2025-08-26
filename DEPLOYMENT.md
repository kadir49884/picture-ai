# 🚀 Vercel Deployment Rehberi

## Ön Gereksinimler

✅ FAL AI hesabı ve API key  
✅ Google Cloud Console projesi  
✅ Vercel hesabı  
✅ Git repository  

## Adım 1: API Keys'leri Hazırlayın

### FAL AI
1. [fal.ai](https://fal.ai) hesabı oluşturun
2. Dashboard'a gidin
3. API Key'inizi kopyalayın

### Google OAuth
1. [Google Cloud Console](https://console.cloud.google.com/) → Yeni proje
2. APIs & Services → Library → Google+ API'yi aktifleştirin
3. Credentials → Create Credentials → OAuth 2.0 Client ID
4. Application type: Web application
5. Authorized redirect URIs:
   - `https://your-app-name.vercel.app/api/auth/callback/google`
6. Client ID ve Secret'ı kaydedin

## Adım 2: Vercel'e Deploy

### CLI ile Deploy
```bash
# Vercel CLI yükleyin (global)
npm i -g vercel

# Login olun
vercel login

# Deploy edin
vercel --prod
```

### GitHub ile Auto Deploy
1. GitHub'a kod push'layın
2. Vercel.com → New Project
3. GitHub repository'nizi seçin
4. Deploy'a tıklayın

## Adım 3: Environment Variables

Vercel Dashboard → Settings → Environment Variables:

```
FAL_KEY=your_fal_api_key_here
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=super_secret_random_string_min_32_chars
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=another_super_secret_random_string_min_32_chars
```

**⚠️ ÖNEMLİ:**
- `NEXTAUTH_URL` tam domain adresinizi içermeli
- Secret'lar en az 32 karakter uzunluğunda olmalı
- Production'da gerçek secrets kullanın

## Adım 4: Test Edin

1. Vercel URL'nizi açın
2. Google ile giriş yapın
3. Görsel oluşturmayı test edin
4. İndirme fonksiyonunu kontrol edin

## Adım 5: Custom Domain (Opsiyonel)

1. Vercel Dashboard → Domains
2. Custom domain ekleyin
3. DNS ayarlarını yapın
4. SSL sertifikası otomatik eklenecek

## 🔧 Troubleshooting

### Authentication Error
- Google OAuth redirect URI'lerini kontrol edin
- NEXTAUTH_URL değişkenini doğrulayın

### API Errors
- FAL_KEY'in doğru ve aktif olduğunu kontrol edin
- Network bağlantısını test edin

### Build Errors
- Node.js version uyumluluğunu kontrol edin
- Dependencies'i güncelleyin: `npm update`

## 📊 Production Önerileri

### Database Migration
Current: In-memory database (data kaybolur)
Recommended: 
- [Vercel Postgres](https://vercel.com/storage/postgres)
- [PlanetScale](https://planetscale.com/)
- [Supabase](https://supabase.com/)

### Monitoring
- [Vercel Analytics](https://vercel.com/analytics)
- [Sentry](https://sentry.io/) error tracking
- [LogRocket](https://logrocket.com/) user sessions

### Performance
- [Vercel Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions)
- CDN optimization
- Image optimization

## 🛡️ Security Checklist

- [ ] Environment variables güvenli
- [ ] Google OAuth domains kısıtlandı
- [ ] API rate limiting aktif
- [ ] HTTPS enforced
- [ ] Error logs sanitized

## 📞 Support

Sorun yaşarsanız:
1. Vercel logs'ları kontrol edin
2. Browser developer console'u inceleyin
3. API response'larını test edin

---
**✅ Deploy tamamlandıysa:** Uygulamanız https://your-app-name.vercel.app adresinde live!