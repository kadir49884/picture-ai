const sqlite3 = require('sqlite3').verbose();

// Veritabanını aç
const db = new sqlite3.Database('./data.db');

// Önce mevcut kullanıcıları listele
console.log('🔍 Mevcut Kullanıcılar:');
console.log('====================');

db.all("SELECT id, email, credits, total_generated, created_at FROM users", (err, rows) => {
  if (err) {
    console.error('Hata:', err);
    return;
  }
  
  console.table(rows);
  
  // Kredisi 4 olan kullanıcıları bul
  const usersWith4Credits = rows.filter(user => user.credits === 4);
  
  if (usersWith4Credits.length > 0) {
    console.log('\n💳 Kredisi 4 olan kullanıcılar:');
    console.table(usersWith4Credits);
    
    // İlk kullanıcının kredisini 1 yap
    const userId = usersWith4Credits[0].id;
    console.log(`\n🔧 Kullanıcı ID ${userId} kredisini 1'e güncelliyorum...`);
    
    db.run("UPDATE users SET credits = 1 WHERE id = ?", [userId], function(err) {
      if (err) {
        console.error('Güncelleme hatası:', err);
      } else {
        console.log('✅ Kredi başarıyla güncellendi!');
        
        // Güncellemeyi doğrula
        db.get("SELECT id, email, credits FROM users WHERE id = ?", [userId], (err, row) => {
          if (err) {
            console.error('Doğrulama hatası:', err);
          } else {
            console.log('\n📋 Güncellenmiş kullanıcı:');
            console.table([row]);
          }
          db.close();
        });
      }
    });
  } else {
    console.log('\n❌ Kredisi 4 olan kullanıcı bulunamadı.');
    db.close();
  }
});
