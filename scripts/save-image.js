// Neon database'den upload'ı görsel dosya olarak kaydet
require('dotenv').config({ path: '.env.local' })

const { neon } = require('@neondatabase/serverless')
const fs = require('fs')
const path = require('path')

const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
const sql = neon(databaseUrl)

async function saveImageFromUpload(uploadId) {
  try {
    if (!uploadId) {
      console.log('❌ Upload ID gerekli!')
      console.log('Kullanım: node scripts/save-image.js <upload_id>')
      console.log('Örnek: node scripts/save-image.js 1')
      return
    }

    console.log(`🔍 Upload #${uploadId} aranıyor...`)
    
    // Upload'ı database'den al
    const upload = await sql`
      SELECT u.*, users.email
      FROM user_uploads u
      LEFT JOIN users ON u.user_id = users.id
      WHERE u.id = ${parseInt(uploadId)}
    `
    
    if (!upload || upload.length === 0) {
      console.log(`❌ Upload #${uploadId} bulunamadı!`)
      return
    }
    
    const uploadData = upload[0]
    console.log(`✅ Upload bulundu:`)
    console.log(`   Kullanıcı: ${uploadData.email}`)
    console.log(`   Prompt: "${uploadData.prompt_used}"`)
    console.log(`   Tarih: ${new Date(uploadData.created_at).toLocaleString('tr-TR')}`)
    console.log(`   Boyut: ${Math.round(uploadData.image_size / 1024)} KB`)
    
    // Base64 data'yı kontrol et
    if (!uploadData.image_data || !uploadData.image_data.startsWith('data:image/')) {
      console.log('❌ Geçersiz görsel data!')
      return
    }
    
    // Data URL'den base64 kısmını ayır
    const matches = uploadData.image_data.match(/^data:image\/([a-zA-Z]*);base64,(.+)$/)
    if (!matches) {
      console.log('❌ Base64 formatı tanınamadı!')
      return
    }
    
    const imageType = matches[1] // jpg, png, etc.
    const base64Data = matches[2]
    
    // Dosya adı oluştur
    const timestamp = new Date(uploadData.created_at).toISOString().replace(/[:.]/g, '-')
    const userEmail = uploadData.email ? uploadData.email.split('@')[0] : 'unknown'
    const fileName = `upload_${uploadId}_${userEmail}_${timestamp}.${imageType}`
    
    // uploads klasörü oluştur
    const uploadsDir = path.join(__dirname, '../saved-uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }
    
    const filePath = path.join(uploadsDir, fileName)
    
    // Base64'ü binary'ye çevir ve kaydet
    const buffer = Buffer.from(base64Data, 'base64')
    fs.writeFileSync(filePath, buffer)
    
    console.log(`💾 Görsel kaydedildi: ${filePath}`)
    console.log(`📁 Dosya boyutu: ${Math.round(buffer.length / 1024)} KB`)
    
    // Generated image varsa o URL'yi de göster
    if (uploadData.generated_image_url) {
      console.log(`🎨 Generated image URL: ${uploadData.generated_image_url}`)
    }
    
  } catch (error) {
    console.error('❌ Hata:', error)
  }
}

// Command line argument'ı al
const uploadId = process.argv[2]
saveImageFromUpload(uploadId)