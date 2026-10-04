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
  if (query.includes('langit') || query.includes('biru')) {
    return 'Cahaya matahari sebenarnya terdiri dari aneka warna pelangi! Udara di atmosfer bumi menyebarkan warna biru lebih kuat ke segala penjuru, sehingga saat siang hari langit kita terlihat biru indah! Di Galaksi Sains kita bisa membuat simulasi pelangi lho! 🌈✨';
  }
  if (query.includes('pecahan') || query.includes('takut') || query.includes('salah')) {
    return 'Jangan pernah takut salah, Sahabat Cilik! Di EduVerse, salah itu bukti bahwa sirkuit petualangan kita sedang bertumbuh. Bayangkan 1 loyang pizza dipotong 4 bagian sama besar: 1 potong itu adalah 1/4 bagian yang lezat! Ayo kita coba bersama! 🍕😄';
  }
  if (query.includes('mars') || query.includes('planet')) {
    return 'Planet Mars memiliki 2 bulan kecil bernama Phobos dan Deimos! Mars berwarna merah bata karena tanahnya mengandung banyak serbuk karat besi. Di sana juga ada gunung tertinggi di tata surya bernama Olympus Mons! 🪐🚀';
  }
  if (query.includes('daun') || query.includes('hijau') || query.includes('pohon')) {
    return 'Daun berwarna hijau karena memiliki zat ajaib bernama klorofil! Klorofil bekerja seperti koki cilik yang memasak makanan untuk tanaman menggunakan sinar matahari dan air lewat proses fotosintesis! 🍃☀️';
  }
  if (query.includes('tata surya') || query.includes('bumi')) {
    return 'Tata surya kita dipimpin oleh Matahari yang hangat, dikelilingi 8 planet istimewa: Merkurius, Venus, Bumi rumah kita, Mars, Jupiter yang raksasa, Saturnus bercincin emas, Uranus, dan Neptunus yang dingin membiru! 🌌🛸';
  }
  return `Pertanyaan yang sangat bagus, Sahabat Penjelajah! Olu senang sekali dengan rasa ingin tahumu. Setiap kali kita bertanya dan mencari tahu, kita sedang membuka gerbang petualangan baru di EduVerse! Teruslah bereksplorasi ya! 🌟🤖`;
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
      // Attempt backend endpoint if running, otherwise use rich curated knowledge fallback
      let reply = '';
      try {
        const res = await fetch('/api/olu/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: text }),
        });
        if (res.ok) {
          const data = await res.json();
          reply = data.reply;
        }
      } catch {
        // Fallback to local response
      }

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
      }, 500);
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
      <div className="relative w-full max-w-2xl h-[85vh] max-h-[700px] flex flex-col rounded-3xl bg-white border-4 border-surface-container-high shadow-[0_16px_0_#d6e2f8] overflow-hidden text-left">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-primary via-primary-container to-secondary text-white flex items-center justify-between shrink-0">
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
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-4 bg-surface-container-low/50">
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
                    : 'bg-white text-on-surface border-2 border-surface-container-high rounded-tl-xs'
                }`}
              >
                <p>{m.text}</p>

                {m.sender === 'olu' && (
                  <div className="mt-2 pt-2 border-t border-surface-container-high flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        playSoundEffect('click');
                        playTTS(m.text);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-black text-primary hover:underline cursor-pointer"
                    >
                      <span>🔊</span>
                      <span>Dengarkan Suara Olu</span>
                    </button>
                    <span className="text-[10px] text-slate-400">{m.time}</span>
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
              <div className="p-3.5 rounded-2xl bg-white border border-surface-container text-xs font-black text-primary animate-pulse">
                Olu sedang berpikir dan menyiapkan jawaban terbaik... ✨
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 sm:px-4 bg-white border-t border-surface-container overflow-x-auto flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-black text-slate-500 shrink-0">
            Ide Tanya:
          </span>
          {QUICK_QUESTIONS.map((qq, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(qq)}
              className="px-3 py-1 rounded-xl bg-surface-container-low hover:bg-surface-container text-[11px] font-extrabold text-on-surface-variant border border-surface-container whitespace-nowrap cursor-pointer transition-all"
            >
              {qq}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-surface-container flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Tanyakan apa saja ke Olu (contoh: Mengapa ada pelangi?)..."
            className="flex-1 px-4 py-3 rounded-2xl bg-surface-container-low border-2 border-surface-container focus:border-primary focus:outline-none text-sm font-bold text-on-surface"
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
