import { GoogleGenAI } from '@google/genai';

function generateSmartFallback(q: string): string {
  const query = q.toLowerCase();

  // Sains & Alam
  if (query.includes('langit') || query.includes('biru')) {
    return 'Cahaya matahari sebenarnya tersusun dari semua warna pelangi! Gas di atmosfer bumi menyebarkan warna biru jauh lebih kuat daripada warna lain, sehingga saat siang hari langit kita terlihat biru indah! Di Galaksi Sains kita bisa mencoba simulasi pelangi lho! 🌈✨';
  }
  if (query.includes('daun') || query.includes('hijau') || query.includes('tumbuhan') || query.includes('pohon')) {
    return 'Daun berwarna hijau karena memiliki zat ajaib bernama klorofil! Klorofil bertindak seperti koki cilik pintar yang memasak makanan untuk pohon dari sinar matahari, udara, dan air lewat fotosintesis! 🍃☀️';
  }
  if (query.includes('mars') || query.includes('planet') || query.includes('tata surya') || query.includes('angkasa')) {
    return 'Planet Mars berwarna merah jingga karena tanahnya kaya akan serbuk karat besi! Di sana ada gunung tertinggi di tata surya bernama Olympus Mons, tingginya hampir 3 kali Gunung Everest! Keren ya! 🪐🚀';
  }
  if (query.includes('pelangi') || query.includes('hujan')) {
    return 'Pelangi muncul saat sinar matahari menembus butiran tetes air hujan di udara! Tetes air itu membiaskan cahaya putih menjadi 7 warna indah: Merah, Jingga, Kuning, Hijau, Biru, Nila, dan Ungu (Me-Ji-Ku-Hi-Bi-Ni-U)! 🌧️🌈';
  }
  if (query.includes('laut') || query.includes('penyu') || query.includes('ikan') || query.includes('boni')) {
    return 'Penyu seperti sahabat kita Boni bisa hidup puluhan tahun dan berenang ribuan kilometer melintasi samudera! Tempurungnya sangat kuat dan melindungi mereka dari arus deras. Mari kita jaga laut agar bebas dari sampah plastik ya! 🐢🌊';
  }
  if (query.includes('dinosaurus') || query.includes('fosil')) {
    return 'Dinosaurus hidup jutaan tahun yang lalu! Ada T-Rex yang bertaring tajam, dan ada Brachiosaurus yang lehernya sangat tinggi melebihi pohon kelapa. Para ilmuwan mengetahui kisah mereka dari fosil batu purba! 🦖🦕';
  }

  // Matematika & Logika
  if (query.includes('pecahan') || query.includes('bagi') || query.includes('hitung') || query.includes('pizza')) {
    return 'Matematika itu seperti teka-teki seru, Sahabat Penjelajah! Bayangkan 1 loyang pizza dipotong menjadi 4 potong sama besar. Mengambil 1 potong berarti kamu memegang 1/4 bagian yang lezat! Jika kamu punya soal berhitung yang sulit, tuliskan angkanya di sini biar Olu bantu hitung! 🍕🧮';
  }
  if (query.includes('takut') || query.includes('salah') || query.includes('sulit') || query.includes('bingung')) {
    return 'Jangan pernah takut salah, Rekan Cilik! Di EduVerse, salah adalah bukti bahwa kita sedang berani mencoba hal baru. Setiap ilmuwan hebat di dunia juga pernah salah sebelum menemukan penemuan luar biasa! Olu selalu ada di sampingmu! 🌟🤖';
  }

  // Budaya & Cerita
  if (query.includes('kancil') || query.includes('cerita') || query.includes('dongeng')) {
    return 'Kancil di Lembah Kata mengajarkan kita bahwa kecerdikan dan kebaikan hati jauh lebih hebat daripada kekuatan fisik! Kamu bisa membaca petualangan lengkap Kancil di menu Cerita EduVerse! 📖✨';
  }
  if (query.includes('indonesia') || query.includes('pancasila') || query.includes('budaya')) {
    return 'Indonesia kita sangat kaya dengan lebih dari 17.000 pulau, ratusan rumah adat, dan semboyan Bhinneka Tunggal Ika yang berarti berbeda-beda tetapi tetap satu jua! Di Pulau Budaya kita bisa belajar semuanya! 🇮🇩🏛️';
  }

  // Gamifikasi EduVerse
  if (query.includes('spark') || query.includes('shard') || query.includes('kota') || query.includes('city') || query.includes('level')) {
    return 'Untuk memperindah EduVerse City, kumpulkan Star Shards dari misi harian di 7 Dunia Belajar! Setiap 1 kuis yang kamu selesaikan memberikanmu puluhan Spark energi dan kepingan Shards untuk membangun observatorium! 🏙️💎';
  }

  return `Pertanyaan yang sangat bagus dan cerdas, Sahabat Penjelajah! Olu senang sekali dengan rasa ingin tahumu tentang "${q}". Setiap kali kita penasaran dan bertanya, sirkuit petualangan kita bertambah pintar. Teruslah bereksplorasi di semesta EduVerse! 🌟🤖`;
}

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { question, context } = req.body || {};
  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'Pertanyaan tidak boleh kosong.' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      reply: generateSmartFallback(question),
      source: 'smart-curated-knowledge',
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `Kamu adalah Olu, robot penjelajah kecil bercahaya yang melayang dan menjadi sahabat setia anak SD (Sekolah Dasar kelas 1-6) di EduVerse.
Karaktermu:
- Ceria, bersemangat, rendah hati, tidak pernah menggurui, dan penuh empati.
- Selalu memakai bahasa Indonesia yang hangat, bersahabat, dan santun.
- Panggil anak dengan sapaan hangat: "Sahabat Penjelajah", "Rekan Cilik", atau "Pionir Hebat".
- Gunakan metode Socratic: jika anak bertanya materi pelajaran, jelaskan dengan analogi visual konkret (seperti buah, kue, hewan, benda di sekitar rumah), bukan rumus kaku.
- Jika anak mengaku takut salah atau merasa kesulitan, semangati: "Tidak apa-apa mencoba, salah adalah bagian dari belajar!"
- Keamanan Anak: Jangan pernah menanyakan nama asli lengkap, alamat rumah, nomor telepon, atau topik dewasa/berbahaya.
- Jawaban ringkas: 2 hingga 4 kalimat bersahabat yang memicu senyuman dan rasa ingin tahu!`;

    // Try reliable Gemini models in order
    const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: `Pertanyaan anak: "${question}". Konteks: ${context || 'Dunia EduVerse SD'}. Jawablah dengan ramah dan memicu rasa ingin tahu!`,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        if (response.text) {
          return res.status(200).json({
            reply: response.text.trim(),
            source: 'gemini-ai',
            model,
          });
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Gemini model ${model} failed, trying next...`, err.message);
      }
    }

    console.error('All Gemini candidate models failed:', lastError?.message);
    return res.status(200).json({
      reply: generateSmartFallback(question),
      source: 'smart-curated-knowledge',
    });
  } catch (error: any) {
    console.error('Olu AI error:', error);
    return res.status(200).json({
      reply: generateSmartFallback(question),
      source: 'smart-curated-knowledge',
    });
  }
}
