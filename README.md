# Picture AI - Görsel Oluşturucu

FAL AI'ın Flux Pro modeliyle güçlendirilmiş modern bir görsel oluşturma uygulaması.

## Özellikler

- 🎨 **AI ile Görsel Oluşturma**: FAL AI Flux Pro/Kontext/Max modeli
- ✨ **Modern UI**: Tailwind CSS ile responsive tasarım
- 🔐 **Güvenli Giriş**: Google OAuth entegrasyonu
- 💳 **Kredi Sistemi**: Stripe ile ödeme entegrasyonu
- 🚀 **Hızlı**: Next.js 14 App Router
- 📱 **Mobil Uyumlu**: Tüm cihazlarda mükemmel görünüm
- 💾 **İndirme**: Oluşturulan görselleri kaydedin
- ☁️ **Vercel Ready**: Production'a hazır

## 🌐 Vercel Deployment

### Hızlı Deploy

1. **Vercel'e deploy edin:**
   ```bash
   npx vercel --prod
   ```

2. **Environment Variables'ları ekleyin** (Vercel Dashboard'da):
   ```json
   {
     "FAL_KEY": "your_fal_api_key_here",
     "NEXTAUTH_URL": "https://your-app-name.vercel.app",
     "NEXTAUTH_SECRET": "your_super_secret_nextauth_key",
     "GOOGLE_CLIENT_ID": "your_google_client_id",
     "GOOGLE_CLIENT_SECRET": "your_google_client_secret",
     "JWT_SECRET": "your_super_secret_jwt_key"
   }
   ```

### API Keys Alma

- **FAL_KEY**: [fal.ai/dashboard](https://fal.ai/dashboard)
- **Google OAuth**: [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
- **Secrets**: [Generate Random String](https://www.uuidgenerator.net/)

### Google OAuth Ayarları

Google Cloud Console'da:
1. "Authorized redirect URIs"'ye ekleyin:
   - `https://your-app-name.vercel.app/api/auth/callback/google`
2. "Authorized JavaScript origins"'e ekleyin:
   - `https://your-app-name.vercel.app`

## Kurulum

1. **Proje bağımlılıklarını yükleyin:**
   ```bash
   npm install
   ```

2. **Çevre değişkenlerini ayarlayın:**
   `.env.local` dosyası oluşturun ve FAL AI API anahtarınızı ekleyin:
   ```
   FAL_KEY=your_fal_api_key_here
   ```

3. **FAL AI API anahtarı almak için:**
   - [fal.ai/dashboard](https://fal.ai/dashboard) adresine gidin
   - Hesap oluşturun veya giriş yapın
   - API anahtarınızı alın

4. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

5. **Tarayıcıda açın:**
   [http://localhost:3000](http://localhost:3000)

## Kullanım

1. Ana sayfada görselini oluşturmak istediğiniz şeyi tanımlayan bir prompt yazın
2. Örnek promptlardan birini seçebilir veya kendi yaratıcı fikirlerinizi yazabilirsiniz
3. "Görsel Oluştur" butonuna tıklayın
4. AI görseli oluşturduktan sonra "İndir" butonuyla kaydedin

## Teknolojiler

- **Next.js 14** - React framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Styling
- **FAL AI** - Görsel oluşturma
- **Lucide React** - İkonlar

## API Kullanımı

Uygulama FAL AI'ın `fal-ai/flux-pro/kontext/max` modelini kullanır:

- **Image Size**: landscape_4_3
- **Inference Steps**: 28
- **Guidance Scale**: 3.5
- **Output Format**: JPEG
- **Quality**: 95%
- **Safety Checker**: Aktif

## Lisans

MIT License
