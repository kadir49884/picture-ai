// Neon database'deki user uploads tablosunu detaylı kontrol et
require('dotenv').config({ path: '.env.local' })

const { neon } = require('@neondatabase/serverless')
const fs = require('fs')
const path = require('path')
const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
const sql = neon(databaseUrl)

async function checkUserUploads() {
  try {
    console.log('🔍 Neon database\'deki user uploads detaylı kontrol ediliyor...\n')
    
    // Tablo var mı kontrol et
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'user_uploads'
      )
    `
    
    console.log('📋 user_uploads tablosu var mı:', tableExists[0].exists)
    
    if (tableExists[0].exists) {
      // Tablo yapısını göster
      const tableStructure = await sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'user_uploads'
        ORDER BY ordinal_position
      `
      
      console.log('\n📊 Tablo yapısı:')
      tableStructure.forEach(col => {
        console.log(`   ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`)
      })
      
      // Toplam upload sayısı
      const totalCount = await sql`SELECT COUNT(*) as count FROM user_uploads`
      console.log(`\n📊 Toplam upload sayısı: ${totalCount[0].count}`)
      
      if (totalCount[0].count > 0) {
        // Son upload'ları göster
        const recentUploads = await sql`
          SELECT 
            u.id,
            u.user_id,
            users.email,
            u.image_size,
            u.prompt_used,
            u.generated_image_url,
            u.upload_type,
            u.created_at,
            CASE 
              WHEN LENGTH(u.image_data) > 100 THEN CONCAT(SUBSTRING(u.image_data, 1, 100), '...')
              ELSE u.image_data
            END as image_preview
          FROM user_uploads u
          LEFT JOIN users ON u.user_id = users.id
          ORDER BY u.created_at DESC
          LIMIT 20
        `
        
        console.log('\n📋 Upload detayları:')
        console.log('========================================================')
        recentUploads.forEach((upload, index) => {
          console.log(`\n${index + 1}. 🖼️  Upload #${upload.id}`)
          console.log(`   👤 Kullanıcı: ${upload.email || 'Bilinmiyor'} (ID: ${upload.user_id})`)
          console.log(`   📏 Boyut: ${Math.round(upload.image_size / 1024)} KB`)
          console.log(`   📝 Prompt: "${upload.prompt_used || 'Prompt yok'}"`)
          console.log(`   🎨 Generated Image: ${upload.generated_image_url || 'Henüz oluşturulmamış'}`)
          console.log(`   📅 Tarih: ${new Date(upload.created_at).toLocaleString('tr-TR')}`)
          console.log(`   🔗 Image Data: ${upload.image_preview}`)
        })
        
        // Kullanıcı bazında istatistik
        const userStats = await sql`
          SELECT 
            users.email,
            COUNT(*) as upload_count,
            SUM(u.image_size) as total_size_bytes,
            AVG(u.image_size) as avg_size_bytes,
            MIN(u.created_at) as first_upload,
            MAX(u.created_at) as last_upload
          FROM user_uploads u
          LEFT JOIN users ON u.user_id = users.id
          GROUP BY users.email, users.id
          ORDER BY upload_count DESC
        `
        
        console.log('\n\n👥 Kullanıcı İstatistikleri:')
        console.log('========================================================')
        userStats.forEach((stat, index) => {
          console.log(`\n${index + 1}. 📧 ${stat.email || 'Bilinmiyor'}`)
          console.log(`   📤 Upload sayısı: ${stat.upload_count}`)
          console.log(`   📏 Toplam boyut: ${Math.round(stat.total_size_bytes / 1024)} KB (${Math.round(stat.total_size_bytes / (1024*1024))} MB)`)
          console.log(`   📊 Ortalama boyut: ${Math.round(stat.avg_size_bytes / 1024)} KB`)
          console.log(`   📅 İlk upload: ${new Date(stat.first_upload).toLocaleString('tr-TR')}`)
          console.log(`   📅 Son upload: ${new Date(stat.last_upload).toLocaleString('tr-TR')}`)
        })
        
        // En son upload'ın tam detayını göster
        if (recentUploads.length > 0) {
          const latestUpload = await sql`
            SELECT u.*, users.email
            FROM user_uploads u
            LEFT JOIN users ON u.user_id = users.id
            ORDER BY u.created_at DESC
            LIMIT 1
          `
          
          if (latestUpload.length > 0) {
            const latest = latestUpload[0]
            console.log('\n\n🔍 EN SON UPLOAD DETAYI:')
            console.log('========================================================')
            console.log(`Upload ID: ${latest.id}`)
            console.log(`Kullanıcı: ${latest.email}`)
            console.log(`Tarih: ${new Date(latest.created_at).toLocaleString('tr-TR')}`)
            console.log(`Prompt: "${latest.prompt_used}"`)
            console.log(`Boyut: ${Math.round(latest.image_size / 1024)} KB`)
            console.log(`Generated URL: ${latest.generated_image_url || 'Yok'}`)
            console.log(`Image Data uzunluğu: ${latest.image_data.length} karakter`)
            console.log(`Image Data başlangıcı: ${latest.image_data.substring(0, 200)}...`)
            
            // Eğer istenirse görseli dosya olarak kaydet
            console.log('\n💾 Bu görseli dosya olarak kaydetmek ister misin?')
            console.log('   node scripts/save-image.js ' + latest.id)
          }
        }
        
      } else {
        console.log('\n📭 Henüz hiç upload yok')
        console.log('\n🔧 Test için:')
        console.log('1. Websitene git: https://picture-6gotgnkbj-kadir49884gmailcoms-projects.vercel.app')
        console.log('2. Image-to-image modunu kullan')
        console.log('3. Bir görsel yükle ve prompt gir')
        console.log('4. Generate butonuna bas')
        console.log('5. Tekrar bu scripti çalıştır: node scripts/check-uploads.js')
      }
    } else {
      console.log('⚠️  user_uploads tablosu henüz oluşturulmamış')
      console.log('\n🔧 Çözüm: Bir kez websiteni ziyaret et ki tablo oluşturulsun')
    }
    
  } catch (error) {
    console.error('❌ Hata:', error)
    console.error('Stack:', error.stack)
  }
}

checkUserUploads()