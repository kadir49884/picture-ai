# LemonSqueezy Setup Guide

Bu proje artık LemonSqueezy ödeme sistemi kullanmaktadır. Paddle tamamen kaldırılmıştır.

## Environment Variables

Aşağıdaki environment variables'ları `.env.local` dosyanıza ekleyin:

```env
# LemonSqueezy Configuration
LEMONSQUEEZY_API_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NGQ1OWNlZi1kYmI4LTRlYTUtYjE3OC1kMjU0MGZjZDY5MTkiLCJqdGkiOiI5Yzc3MmUyN2YwOTY0OTJmZmVmZDM1YmUzOWMwMTAyMmQ0ZGY3MDZmOTE2OWM2NGRlYTYzODM3NWZkMTk3NTU0N2FmY2JkOGUyZDVjMDVmZSIsImlhdCI6MTc1OTIzNDY2MS42Mzk0NDUsIm5iZiI6MTc1OTIzNDY2MS42Mzk0NDcsImV4cCI6MjA3NDc2NzQ2MS42MjUzNDcsInN1YiI6IjU2MTAzNTIiLCJzY29wZXMiOltdfQ.QkB0w9sEn6lNoyjigYQXRT7JNZUCY0n2lxEEgLIi0x1q0LVHeVngwvWmkLMW6N9XSLiRRVFU_oWtTlTGyHa0TCgsQatdFQ1YQXRT7JNZUCY0n2lxEEgLIi0x1q0LVHeVngwvWmkLMW6N9XSLiRRVFU_oWtTlTGyHa0TCgsQatdFQ1YWThw7jq-b0EQGtpjH-so7NCW4y2uIfry4gVRe6T2aLeTitSPj5MMc5dPzPDZkmLbZaY1PD3lGNDGz51wfd4T0MRmy4GOPK6M44QlYBsLjCHAlYavijjmdSOlqUen-8G0TkkMID4YFGuULu46gRQn-xhKdaiN28awewrHcGKdYbMkF_HNRQIl-Gz9_4DWurOEVceByaABDY9pUXonvcicxtF339EPsnQHYr2Kn8uPNTIQ2kI4L85vbb7xZKoukf6NcFM1Ubcbe_E1PieRjLXV5qfakHtjyP9KwDQLXXFe0qc53GjLkJNB0y1RG5hquoOMmhRF5brCRHlqasY1_f5uuTmjPA7ZIr4-runxODb00eoWvB7RwFXkd7qzWDH-6lZgev5pmZumkCUhaqR7go04ObuWZzMTOShS5R7h3xuN4I7jD9Yziye04zAxNlKGp_0WJm7td1FMew7neEHyrELeYmoPjcEdUVRtFkv_tWV1adNMvDRMMOV_YlJ8wnPR5TCEft0LSYmopGovw5qryrcA2qeleQGTA3FkZGvVlWb7HiMG6nbjy8jmXHT0HzBXrg5i5p0tuS0HqCY
LEMONSQUEEZY_STORE_ID=226330
LEMONSQUEEZY_WEBHOOK_SECRET=my-super-secret-654321

# Product IDs - Get these from your LemonSqueezy dashboard
LEMONSQUEEZY_PRODUCT_ID=your_actual_product_id_here
LEMONSQUEEZY_YEARLY_PRODUCT_ID=your_actual_yearly_product_id_here
```

## Webhook Configuration

LemonSqueezy dashboard'da aşağıdaki webhook ayarlarını yapın:

- **Webhook URL**: `https://picture-ai-olive.vercel.app/api/lemonsqueezy/webhook`
- **Webhook Secret**: `my-super-secret-654321`
- **Events**: subscription_created, subscription_updated, subscription_cancelled, subscription_resumed, subscription_expired, subscription_paused

## Product Configuration

`lib/lemonsqueezy.ts` dosyasında `LEMONSQUEEZY_PRODUCTS` objesini gerçek product ID'lerinizle güncelleyin:

```typescript
export const LEMONSQUEEZY_PRODUCTS = {
  PRO_MONTHLY: 'prod_GERÇEK_PRODUCT_ID', // LemonSqueezy dashboard'dan alın
  PRO_YEARLY: 'prod_GERÇEK_PRODUCT_ID', // LemonSqueezy dashboard'dan alın
}
```

## Değişiklik Özeti

### Eklenen Dosyalar
- `app/api/lemonsqueezy/webhook/route.ts` - LemonSqueezy webhook handler
- `lib/lemonsqueezy.ts` - LemonSqueezy helper functions
- `LEMONSQUEEZY_SETUP.md` - Bu setup dosyası

### Kaldırılan Dosyalar
- `app/api/paddle/webhook/route.ts` - Paddle webhook handler

### Güncellenen Dosyalar
- `app/pricing/page.tsx` - LemonSqueezy checkout entegrasyonu
- `app/layout.tsx` - Paddle SDK kaldırıldı
- `types/next-auth.d.ts` - Paddle tip tanımlamaları kaldırıldı
- `app/refund/page.tsx` - Paddle referansları LemonSqueezy ile değiştirildi
- `app/terms/page.tsx` - Paddle referansları LemonSqueezy ile değiştirildi
- `app/privacy/page.tsx` - Paddle referansları LemonSqueezy ile değiştirildi

## Test Etme

1. Environment variables'ları ayarlayın
2. LemonSqueezy webhook'u test edin
3. Pricing sayfasında checkout akışını test edin
4. Webhook'un doğru çalıştığını verify edin

## Notlar

- LemonSqueezy paketi zaten `package.json`'da mevcuttu
- Tüm Paddle referansları temizlendi
- Sistem artık tamamen LemonSqueezy üzerinde çalışıyor
- Webhook signature verification aktif
- Fallback mekanizmaları development için korundu
