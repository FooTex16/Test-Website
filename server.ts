import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function generateOluFallback(q: string): string {
  const query = q.toLowerCase();
  if (query.includes('langit') || query.includes('biru')) {
    return 'Cahaya matahari terdiri dari aneka warna pelangi! Udara di atmosfer bumi menyebarkan warna biru lebih kuat ke segala arah, sehingga langit kita terlihat membiru indah. Di Galaksi Sains kita bisa membuat simulasi pelangi lho! 🌈';
  }
  if (query.includes('pecahan') || query.includes('takut') || query.includes('salah')) {
    return 'Jangan pernah cemas bila keliru, Sahabat Penjelajah! Di EduVerse, salah adalah tanda bahwa sirkuit petualangan kita sedang belajar. Bayangkan 1 loyang martabak manis dibagi 4 bagian sama rata: 1 potong adalah 1/4 bagian yang manis! 🍕';
  }
  if (query.includes('pohon') || query.includes('spark') || query.includes('kota') || query.includes('city')) {
    return 'Kumpulkan 80 Spark dan Star Shards dari misi harian di Pulau Numeria atau Sains! Pohon emas dan laboratorium kotamu akan langsung mekar bercahaya di EduVerse City! 🏙️✨';
  }
  if (query.includes('mars') || query.includes('planet')) {
    return 'Planet Mars berwarna merah jingga karena permukaannya diselimuti serbuk karat besi! Di sana juga ada gunung tertinggi di seluruh tata surya bernama Olympus Mons! 🚀';
  }
  if (query.includes('daun') || query.includes('hijau') || query.includes('tumbuhan')) {
    return 'Daun berwarna hijau karena memiliki pabrik mungil bernama klorofil! Klorofil menyerap cahaya matahari untuk memasak makanan bagi pohon lewat proses fotosintesis! 🍃';
  }
  if (query.includes('penyu') || query.includes('boni') || query.includes('laut')) {
    return 'Penyu seperti Boni sangat menyukai arus air laut hangat bersuhu 27°C hingga 29°C di terumbu karang supaya tempurung dan siripnya kuat berenang jauh ke Raja Ampat! 🐢🌊';
  }
  return 'Wah, rasa penasaranmu luar biasa, Rekan Cilik! Setiap pertanyaan yang kamu ajukan adalah kunci untuk membuka pintu pengetahuan baru di semesta EduVerse. Ayo kita cari tahu bersama! 🌟';
}

// Olu AI Chat Endpoint (Server-Side @google/genai)
app.post('/api/olu/chat', async (req, res) => {
  try {
    const { question, context } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Pertanyaan tidak boleh kosong.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json({
        reply: generateOluFallback(question),
        source: 'curated-knowledge',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `Kamu adalah Olu, robot penjelajah kecil yang melayang dan menjadi sahabat setia anak SD (Sekolah Dasar kelas 1-6) di EduVerse.
Karaktermu:
- Ceria, bersemangat, rendah hati, tidak pernah menggurui, dan penuh empati.
- Selalu memakai bahasa Indonesia yang hangat, bersahabat, dan santun.
- Panggil anak dengan sapaan hangat: "Sahabat Penjelajah", "Rekan Cilik", atau "Pionir Hebat".
- Gunakan metode Socratic: jika anak bertanya materi pelajaran, jelaskan dengan analogi visual konkret (seperti buah, kue, hewan, benda di sekitar rumah), bukan rumus kaku.
- Jika anak mengaku takut salah atau merasa kesulitan, semangati: "Tidak apa-apa mencoba, salah adalah bagian dari belajar!"
- Keamanan Anak: Jangan pernah menanyakan nama asli lengkap, alamat rumah, nomor telepon, atau topik dewasa/berbahaya.
- Jawaban ringkas: 2 hingga 4 kalimat bersahabat agar nyaman dibaca anak usia SD.`;

    const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    let reply = '';

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: `Pertanyaan anak: "${question}". Konteks petualangan: ${context || 'Dunia EduVerse SD'}. Jawablah dengan ramah dan memicu rasa ingin tahu!`,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
        if (response.text) {
          reply = response.text.trim();
          break;
        }
      } catch (mErr: any) {
        console.warn(`Model ${model} failed, trying next...`, mErr.message);
      }
    }

    if (!reply) {
      reply = generateOluFallback(question);
    }
    return res.json({ reply, source: 'gemini-ai' });
  } catch (error) {
    console.error('Olu AI API error:', error);
    const { question } = req.body || {};
    return res.json({
      reply: generateOluFallback(question || ''),
      source: 'curated-knowledge',
    });
  }
});

// Google Sheets Auth Relay Endpoint (CORS-safe & direct)
const GAS_ENDPOINT_URL = 'https://script.google.com/macros/s/AKfycbzKdfd9BvndyAVd_9CzdFt3vX3Rk37iGLqwkCPCVO8sQmiLNRtaVqzdsON66tJH2T92/exec';

app.post('/api/auth/google-sheets', async (req, res) => {
  try {
    const { action, username, password } = req.body;
    if (!action || !username || !password) {
      return res.status(400).json({ status: 'error', message: 'Username, password, dan aksi diperlukan.' });
    }

    // Call Google Apps Script with both URL query params and POST body for maximum script compatibility
    const targetUrl = new URL(GAS_ENDPOINT_URL);
    targetUrl.searchParams.set('action', action);
    targetUrl.searchParams.set('username', username);
    targetUrl.searchParams.set('password', password);

    const gasResponse = await fetch(targetUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, username, password }),
      redirect: 'follow',
    });

    const rawText = await gasResponse.text();
    let jsonResult;
    try {
      jsonResult = JSON.parse(rawText);
    } catch {
      // If GAS returned HTML/plain text, wrap in standard response
      const isOk = rawText.toLowerCase().includes('success') || rawText.toLowerCase().includes('berhasil');
      jsonResult = {
        status: isOk ? 'success' : 'info',
        message: rawText.replace(/<[^>]*>?/gm, '').trim() || (isOk ? 'Operasi berhasil' : rawText),
      };
    }

    return res.json(jsonResult);
  } catch (err: any) {
    console.error('GAS Relay error:', err);
    return res.status(500).json({ status: 'error', message: err.message || 'Gagal menyambung ke server Google Sheets' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`EduVerse server running on http://localhost:${PORT}`);
  });
}

startServer();
