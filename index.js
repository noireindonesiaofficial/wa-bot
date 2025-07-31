const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();

app.use(express.json());

// Lokasi Chrome di Windows (ubah jika berbeda)
const CHROME_PATH = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: CHROME_PATH,
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    }
});

// QR Code saat login pertama
client.on('qr', qr => {
    console.log('📲 Scan QR ini untuk login:');
    qrcode.generate(qr, { small: true });
});

// Saat bot siap
client.on('ready', () => {
    console.log('✅ Bot sudah siap!');
});

// ✅ Endpoint GET untuk ping
app.get('/ping', (req, res) => {
    res.json({ success: true, message: "API is running 🚀" });
});

// ✅ Endpoint POST untuk kirim pesan
app.post('/send', async (req, res) => {
    const { number, message } = req.body;

    if (!number || !message) {
        return res.status(400).json({ success: false, error: "Number and message are required" });
    }

    const chatId = number + "@c.us";

    try {
        await client.sendMessage(chatId, message);
        res.json({ success: true, message: `Pesan terkirim ke ${number}` });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

client.initialize();
app.listen(5000, () => console.log('🚀 API berjalan di http://localhost:5000'));