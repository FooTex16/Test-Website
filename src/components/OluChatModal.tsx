import React, { useState, useRef, useEffect } from 'react';
import { playSoundEffect, playTTS, stopTTS } from '../utils/audio';

interface OluChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  sender: 'olu' | 'kid';
  text: string;
  time: string;
}

const QUICK_QUESTIONS = [
  'Mengapa langit berwarna biru? 🌈',
  'Aku takut salah belajar pecahan 🍕',
  'Berapa banyak bulan di planet Mars? 🪐',
  'Mengapa daun berwarna hijau? 🍃',
  'Bagaimana cara pohon makan? 🌳',
  'Berapa jumlah planet di tata surya? 🚀',
];

function getLocalOluAnswer(q: string): string {
  const query = q.toLowerCase();

  // Matematika Dasar
  const mathMatch = query.match(/(\d+)\s*([+\-*x/]|ditambah|dikurang|dikali|dibagi)\s*(\d+)/i);
  if (mathMatch) {
    const n1 = parseInt(mathMatch[1], 10);
    const op = mathMatch[2].toLowerCase();
    const n2 = parseInt(mathMatch[3], 10);
    let result = 0;
    let opName = '';
    if (op === '+' || op === 'ditambah') {
      result = n1 + n2;
      opName = 'ditambah';
    } else if (op === '-' || op === 'dikurang') {
      result = n1 - n2;
      opName = 'dikurangi';
    } else if (op === '*' || op === 'x' || op === 'dikali') {
      result = n1 * n2;
      opName = 'dikali';
    } else if (op === '/' || op === 'dibagi') {
      result = n2 !== 0 ? Math.round((n1 / n2) * 100) / 100 : 0;
      opName = 'dibagi';
    }
    return `Hasil perhitungan ${n1} ${opName} ${n2} adalah ${result}! 🧮 Kamu hebat sudah berani mencoba berhitung. Ingin Olu bantu hitung angka lainnya?`;
  }

  // Pecahan
  if (query.includes('pecahan') || query.includes('setengah') || query.includes('seperempat')) {
    return 'Bayangkan 1 loyang pizza dipotong menjadi 4 bagian sama besar: 1 potong itu nilainya 1/4 (seperempat)! Jika kamu makan 2 potong, artinya kamu sudah makan 2/4 atau 1/2 loyang! Mudah dibayangkan kan? 🍕😄';
  }

  // Sains & Alam
  if (query.includes('langit') || query.includes('biru')) {
    return 'Cahaya matahari sebenarnya tersusun dari semua warna pelangi! Gas di atmosfer bumi menyebarkan warna biru lebih kuat ke segala penjuru, sehingga saat siang hari langit kita terlihat biru indah! Di Galaksi Sains kita bisa membuat simulasi pelangi lho! 🌈✨';
  }
  if (query.includes('daun') || query.includes('hijau') || query.includes('pohon') || query.includes('fotosintesis')) {
    return 'Daun berwarna hijau karena memiliki zat ajaib bernama klorofil! Klorofil bekerja seperti koki cilik pintar yang memasak makanan untuk tumbuhan menggunakan sinar matahari, air, dan udara lewat fotosintesis! 🍃☀️';
  }
  if (query.includes('mars') || query.includes('planet') || query.includes('tata surya') || query.includes('bintang')) {
    return 'Tata surya kita memiliki 8 planet utama yang mengitari Matahari! Planet Mars berwarna merah jingga karena tanahnya kaya akan serbuk karat besi. Di sana juga ada gunung tertinggi di tata surya bernama Olympus Mons! 🪐🚀';
  }
  if (query.includes('pelangi') || query.includes('hujan')) {
    return 'Pelangi terbentuk saat tetesan air hujan membiaskan dan memantulkan sinar matahari menjadi spektrum 7 warna: Me-Ji-Ku-Hi-Bi-Ni-U (Merah, Jingga, Kuning, Hijau, Biru, Nila, Ungu)! 🌧️🌈';
  }
  if (query.includes('penyu') || query.includes('boni') || query.includes('laut') || query.includes('ikan')) {
    return 'Penyu seperti sahabat kita si Boni sangat menyukai laut yang bersih dan hangat bersuhu 27°C-29°C! Boni berenang melintasi samudera dari Raja Ampat dengan tempurung kuatnya. Mari kita jaga laut agar tidak kotor oleh plastik! 🐢🌊';
  }
  if (query.includes('dinosaurus') || query.includes('purba') || query.includes('fosil')) {
    return 'Dinosaurus hidup jutaan tahun yang lalu pada zaman Mesozoikum! Ada T-Rex karnivora yang perkasa, Triceratops bertanduk tiga, dan Brachiosaurus yang lehernya sangat panjang untuk makan daun di puncak pohon! 🦖🦕';
  }
  if (query.includes('magnet') || query.includes('listrik')) {
    return 'Magnet memiliki dua kutub istimewa: Kutub Utara dan Kutub Selatan! Jika kutub yang sama didekatkan, mereka akan saling tolak-menolak. Tapi jika kutub berbeda bertemu, mereka akan saling tarik-menarik dengan kuat! 🧲⚡';
  }
  if (query.includes('gunung') || query.includes('gempa') || query.includes('lahar')) {
    return 'Di dalam perut bumi suhunya sangat panas sehingga batuan bisa meleleh menjadi magma! Saat tekanan di dalam bumi memuncak, magma itu keluar melalui kawah gunung berapi dan disebut lava! 🌋';
  }

  // Logika, Rasa Percaya Diri, dan Belajar
  if (query.includes('takut') || query.includes('salah') || query.includes('bingung') || query.includes('susah') || query.includes('sulit')) {
    return 'Jangan pernah takut salah, Sahabat Cilik! Di EduVerse, salah adalah tanda sirkuit petualanganmu sedang berkembang dan belajar hal baru. Penemu lampu, Thomas Edison, mencoba ribuan kali sebelum berhasil! Kamu pasti bisa! 💪🌟';
  }
  if (query.includes('malas') || query.includes('bosan') || query.includes('capek')) {
    return 'Tidak apa-apa istirahat sejenak, Rekan Cilik! Minum segelas air putih, regangkan tanganmu ke atas, dan lihat ke luar jendela. Setelah energimu terisi lagi, ayo kita jelajahi misi seru berikutnya! 💧🌱';
  }

  // Budaya & Nusantara
  if (query.includes('kancil') || query.includes('dongeng') || query.includes('cerita')) {
    return 'Dongeng Kancil di Lembah Kata mengajarkan kita agar selalu menggunakan kecerdikan untuk membantu sesama, bukan untuk menjahili teman. Kamu bisa membaca cerita serunya di menu Cerita EduVerse! 📖🦊';
  }
  if (query.includes('pancasila') || query.includes('indonesia') || query.includes('budaya') || query.includes('garuda')) {
    return 'Burung Garuda adalah lambang negara kita yang gagah! Di dadanya ada 5 perisai Pancasila, dan cakarnya menggenggam pita bertuliskan "Bhinneka Tunggal Ika", yang artinya berbeda-beda tetapi kita tetap bersatu rukun! 🇮🇩🏛️';
  }

  // Gamifikasi EduVerse
  if (query.includes('spark') || query.includes('shard') || query.includes('kota') || query.includes('city')) {
    return 'Kumpulkan Spark dan Star Shards dengan menyelesaikan misi harian di 7 Dunia Belajar! Shards bisa kamu pakai untuk membangun Menara Logika, Observatorium, dan Taman Sains di Kotaku! 🏙️💎';
  }

  return `Pertanyaan yang sangat cerdas, Sahabat Penjelajah! Olu senang sekali dengan rasa ingin tahumu tentang "${q}". Setiap kali kita penasaran dan bertanya, kita membuka gerbang pengetahuan baru di EduVerse! Ada lagi yang ingin kamu ketahui? 🌟🤖`;
}

export const OluChatModal: React.FC<OluChatModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'olu',
      text: 'Halo Sahabat Penjelajah! Aku Olu, robot sahabatmu di EduVerse. Kamu ingin tahu tentang apa hari ini? Kamu bisa klik pertanyaan di bawah atau ketik sendiri!',
      time: 'Baru saja',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      stopTTS();
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    playSoundEffect('click');

    const newMessages: ChatMessage[] = [
      ...messages,
      { sender: 'kid', text, time: 'Sekarang' },
    ];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      let reply = '';

      // Tier 1: Try serverless /api/olu/chat
      try {
        const res = await fetch('/api/olu/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: text }),
        });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (data && data.reply) {
            reply = data.reply;
          }
        }
      } catch {
        // Continue to Tier 2
      }

      // Tier 2: Try direct client-side Gemini if Vite env key exists
      if (!reply) {
        try {
          const clientKey =
            (import.meta as any).env?.VITE_GEMINI_API_KEY ||
            (import.meta as any).env?.GEMINI_API_KEY;
          if (clientKey && clientKey !== 'YOUR_GEMINI_API_KEY_HERE') {
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${clientKey}`;
            const gRes = await fetch(geminiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: `Kamu adalah Olu, robot sahabat anak SD yang ramah, hangat, dan Socratic. Jawab pertanyaan anak usia SD ini dengan ceria, 2-3 kalimat: "${text}"` }] }],
              }),
            });
            if (gRes.ok) {
              const gData = await gRes.json();
              const cand = gData.candidates?.[0]?.content?.parts?.[0]?.text;
              if (cand) reply = cand.trim();
            }
          }
        } catch {
          // Continue to smart local knowledge
        }
      }

      // Tier 3: High-quality smart curated knowledge base
      if (!reply) {
        reply = getLocalOluAnswer(text);
      }

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: 'olu', text: reply, time: 'Baru saja' },
        ]);
        setIsLoading(false);
        playSoundEffect('hint');
      }, 400);
    } catch {
      const fallback = getLocalOluAnswer(text);
      setMessages((prev) => [
        ...prev,
        { sender: 'olu', text: fallback, time: 'Baru saja' },
      ]);
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
    >
      <div className="relative w-full max-w-2xl h-[85vh] max-h-[700px] flex flex-col rounded-3xl bg-surface-container-lowest dark:bg-[#161f2e] border-4 border-surface-container-high dark:border-slate-700 shadow-[0_16px_0_#d6e2f8] dark:shadow-[0_16px_0_#0f172a] overflow-hidden text-left">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-primary via-primary-container to-secondary text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl animate-float">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-lg sm:text-xl text-white">
                  Olu Bot Penjelajah
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950 font-black text-[10px]">
                  ● Aktif Membantu
                </span>
              </div>
              <p className="text-xs font-bold text-teal-100">
                Sahabat Cilik yang Ramah &amp; Sabar Menjawab Pertanyaan SD
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playSoundEffect('click');
              stopTTS();
              onClose();
            }}
            className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-black text-xl transition-all cursor-pointer"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Chat Messages */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-4 bg-surface-container-low/40 dark:bg-[#0d131f]/70">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-[85%] ${
                m.sender === 'kid' ? 'self-end flex-row-reverse' : 'self-start'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-xs ${
                  m.sender === 'kid'
                    ? 'bg-secondary text-white'
                    : 'bg-primary-container text-2xl animate-float'
                }`}
              >
                {m.sender === 'kid' ? '🧑‍🚀' : '🤖'}
              </div>

              <div
                className={`p-4 rounded-3xl text-sm font-bold leading-relaxed shadow-sm ${
                  m.sender === 'kid'
                    ? 'bg-secondary text-white rounded-tr-xs'
                    : 'bg-surface-container-lowest dark:bg-[#1e293b] text-on-surface dark:text-slate-100 border-2 border-surface-container-high dark:border-slate-700 rounded-tl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>

                {m.sender === 'olu' && (
                  <div className="mt-2 pt-2 border-t border-surface-container-high dark:border-slate-700/60 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        playSoundEffect('click');
                        playTTS(m.text);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-black text-primary dark:text-teal-400 hover:underline cursor-pointer"
                    >
                      <span>🔊</span>
                      <span>Dengarkan Suara Olu</span>
                    </button>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{m.time}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 max-w-[80%] self-start items-center">
              <div className="w-10 h-10 rounded-2xl bg-primary-container flex items-center justify-center text-2xl animate-spin">
                ⚙️
              </div>
              <div className="p-3.5 rounded-2xl bg-surface-container-lowest dark:bg-[#1e293b] border border-surface-container dark:border-slate-700 text-xs font-black text-primary dark:text-teal-400 animate-pulse">
                Olu sedang berpikir dan menyiapkan jawaban terbaik... ✨
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 sm:px-4 bg-surface-container-lowest dark:bg-[#161f2e] border-t border-surface-container dark:border-slate-800 overflow-x-auto flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 shrink-0">
            Ide Tanya:
          </span>
          {QUICK_QUESTIONS.map((qq, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(qq)}
              className="px-3 py-1 rounded-xl bg-surface-container-low dark:bg-[#1f2a3e] hover:bg-surface-container text-[11px] font-extrabold text-on-surface-variant dark:text-slate-200 border border-surface-container dark:border-slate-700 whitespace-nowrap cursor-pointer transition-all"
            >
              {qq}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-surface-container-lowest dark:bg-[#161f2e] border-t border-surface-container dark:border-slate-800 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Tanyakan apa saja ke Olu (contoh: Mengapa ada pelangi?)..."
            className="flex-1 px-4 py-3 rounded-2xl bg-surface-container-low dark:bg-[#0f172a] border-2 border-surface-container dark:border-slate-700 focus:border-primary focus:outline-none text-sm font-bold text-on-surface dark:text-slate-100"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="px-5 py-3 rounded-2xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-black text-sm shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Kirim</span>
            <span>🚀</span>
          </button>
        </div>
      </div>
    </div>
  );
};
