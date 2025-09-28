const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Static files'ları public klasöründen servis et
app.use(express.static(path.join(__dirname, 'public')));

// Ana route - index.html'yi servis et
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Success route - success.html'yi servis et
app.get('/success.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

// Server'ı başlat
app.listen(PORT, () => {
    console.log(`🚀 Server çalışıyor: http://localhost:${PORT}`);
    console.log(`📝 Kurulum talimatları:`);
    console.log(`1. npm install express`);
    console.log(`2. node server.js`);
    console.log(`3. ngrok http 3000`);
    console.log(`4. ngrok URL'ini Paddle Dashboard → Checkout → Website Approval'a ekle`);
    console.log(`5. ngrok URL'ini tarayıcıda aç ve test et`);
});

/*
KURULUM TALİMATLARI:
1. npm install express
2. node server.js
3. ngrok http 3000
4. Copy the https://random.ngrok.io domain and add it to Paddle Dashboard → Checkout → Website Approval
5. Then open the ngrok URL in the browser to test the live Paddle checkout
*/
