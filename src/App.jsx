import React, { useState, useEffect } from "react";

const App = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("id_male");

  const VOICES = {
    id_male: {
      name: "Wijaya",
      id: "21m00Tcm4TlvDq8ikWAM",
      lang: "Indonesia",
      flag: "🇮🇩",
      desc: "Suara remaja pria formal & jelas",
    },
    en_male: {
      name: "Alice",
      id: "Xb7hH8MSUJpSbSDYk0k2",
      lang: "English (US)",
      flag: "🇺🇸",
      desc: "Casual conversation tone",
    },
  };

  const API_KEY = import.meta.env.VITE_ELEVENLABS_KEY;
  const activeVoiceId = VOICES[selectedVoice].id;

  useEffect(() => {
    const savedTheme = localStorage.getItem("tts-theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("tts-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("tts-theme", "light");
    }
  };

  const handleConvert = async () => {
    if (!text) {
      setError("Tolong isi teksnya dulu ya! ✍️");
      return;
    }

    setIsLoading(true);
    setError("");
    setAudioUrl(null);

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${activeVoiceId}`,
        {
          method: "POST",
          headers: {
            Accept: "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": API_KEY,
          },
          body: JSON.stringify({
            text: text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail?.message ||
            "Gagal mengambil data suara. Cek API Key.",
        );
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="title">
      <div className="min-h-screen lg:min-h-auto overflow-auto lg:overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50/30 to-teal-50 dark:from-slate-950 dark:via-cyan-950/20 dark:to-teal-950 transition-all duration-700 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-300/15 dark:bg-teal-400/8 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-300/15 dark:bg-cyan-400/8 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-emerald-200/10 dark:bg-emerald-400/5 rounded-full blur-3xl animate-float"></div>

          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        </div>

        <div className="w-full max-w-7xl relative z-10">
          {/* HEADER - Refined & Minimal */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6">
            <div className="flex items-center gap-4">
              <img
                src="/icon-tts.png"
                alt="TTS Logo"
                className="w-12 h-12 animate-float"
              />

              <div>
                <h1 className="text-4xl sm:text-5xl font-light text-slate-900 dark:text-white tracking-tight">
                  Text
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 dark:from-teal-300 dark:via-cyan-300 dark:to-blue-400">
                    toSpeech
                  </span>
                </h1>
                <p className="text-slate-500 dark:text-slate-300 text-sm font-light tracking-wide mt-1">
                  A simple text to speech website
                </p>
              </div>
            </div>

            {/* Theme Toggle - Elegant */}
            <button
              onClick={toggleTheme}
              className="group relative px-6 py-3 bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl rounded-full shadow-lg border border-teal-200/50 dark:border-teal-600/40 hover:shadow-xl hover:border-teal-300 dark:hover:border-teal-500 transition-all duration-300"
              aria-label="Toggle theme"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-5 h-5">
                  <span
                    className={`absolute inset-0 transition-all duration-500 ${isDarkMode ? "opacity-0 rotate-90" : "opacity-100 rotate-0"}`}
                  >
                    ☀️
                  </span>
                  <span
                    className={`absolute inset-0 transition-all duration-500 ${isDarkMode ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"}`}
                  >
                    🌙
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-100">
                  {isDarkMode ? "Dark" : "Light"}
                </span>
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* LEFT COLUMN: Controls & Input */}
            <div className="xl:col-span-7 space-y-8">
              {/* CARD: Voice Selection - Luxury Design */}
              <div className="group bg-white/60 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-teal-100/60 dark:border-teal-700/30 hover:shadow-3xl hover:border-teal-200/80 dark:hover:border-teal-600/50 transition-all duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-teal-500 to-blue-500 rounded-full"></div>
                  <label className="text-sm uppercase tracking-[0.2em] font-semibold text-slate-400 dark:text-slate-300">
                    Select Voice
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(VOICES).map(([key, voice]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedVoice(key)}
                      className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-500 overflow-hidden group/voice ${
                        selectedVoice === key
                          ? "border-teal-400 dark:border-teal-400 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/40 dark:to-cyan-900/40 shadow-xl shadow-teal-200/50 dark:shadow-teal-800/30"
                          : "border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-lg"
                      }`}
                    >
                      {/* Accent line */}
                      {selectedVoice === key && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500"></div>
                      )}

                      <div className="flex justify-between items-start mb-3">
                        <span className="text-4xl filter drop-shadow-lg transition-transform  dark:text-slate-50 duration-300 group-hover/voice:scale-110">
                          {voice.flag}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="font-bold text-lg text-slate-800 dark:text-slate-50 group-hover/voice:text-teal-600 dark:group-hover/voice:text-teal-300 transition-colors">
                          {voice.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-300 font-light">
                          {voice.desc}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-teal-400 uppercase tracking-wider font-semibold mt-2">
                          {voice.lang}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* CARD: Text Input - Premium Feel */}
              <div className="bg-white/60 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-teal-100/60 dark:border-teal-700/30 transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-teal-500 to-blue-500 rounded-full"></div>
                    <label className="text-sm uppercase tracking-[0.2em] font-semibold text-slate-400 dark:text-slate-300">
                      Enter Text
                    </label>
                  </div>
                  <span
                    className={`text-xs font-mono font-semibold px-3 py-1 rounded-full ${
                      text.length > 500
                        ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                        : "bg-teal-50 dark:bg-teal-900/40 text-teal-600 dark:text-teal-300"
                    }`}
                  >
                    {text.length} / 1000
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    placeholder="Type your message here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-48 bg-slate-50/50 dark:bg-slate-950/70 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-slate-700 dark:text-white focus:outline-none focus:border-teal-400 dark:focus:border-teal-400 focus:ring-4 focus:ring-teal-400/10 dark:focus:ring-teal-400/15 transition-all duration-300 resize-none font-light text-lg leading-relaxed placeholder-slate-400 dark:placeholder-slate-500"
                    maxLength={1000}
                  />

                  {/* Elegant Corner Accent */}
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-teal-300 dark:border-teal-600 rounded-br-lg opacity-30"></div>
                </div>

                {/* Action Button - Luxury */}
                <div className="mt-8">
                  <button
                    onClick={handleConvert}
                    disabled={isLoading || !text}
                    className="group/btn relative w-full py-5 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 hover:from-teal-400 hover:via-cyan-400 hover:to-blue-400 text-slate-900 dark:text-white rounded-2xl font-semibold text-lg shadow-2xl shadow-teal-500/30 hover:shadow-teal-500/50 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-500 overflow-hidden"
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                    <div className="relative flex items-center justify-center gap-3">
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span className="tracking-wide">
                            Generating Audio...
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="tracking-wide ">Generate Voice</span>
                          <span className="text-2xl transition-transform group-hover/btn:scale-110">
                            ✨
                          </span>
                        </>
                      )}
                    </div>
                  </button>
                </div>

                {/* Error Message - Refined */}
                {error && (
                  <div className="mt-6 p-5 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-l-4 border-red-500 dark:border-red-500 rounded-xl flex items-start gap-4 animate-shake shadow-lg">
                    <span className="text-2xl flex-shrink-0">⚠️</span>
                    <div>
                      <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                        {error}
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-light">
                        Please check your input and try again.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Result & Visuals - Sophisticated */}
            <div className="xl:col-span-5">
              <div
                className={`sticky top-8 bg-white/60 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-8 border border-teal-100/60 dark:border-teal-700/30 shadow-2xl transition-all duration-700 min-h-[600px] flex flex-col justify-center ${
                  audioUrl ? "shadow-3xl" : ""
                }`}
              >
                {!audioUrl ? (
                  <div className="text-center space-y-6">
                    <div className="relative mx-auto w-40 h-40">
                      {/* Rotating ring */}
                      <div className="absolute inset-0 rounded-full border-4 border-teal-100 dark:border-teal-800/60"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-teal-400 dark:border-t-teal-400 animate-spin-slow"></div>

                      {/* Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center shadow-inner">
                          <span className="text-5xl grayscale opacity-40">
                            🎧
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-slate-500 dark:text-slate-200 font-light text-lg">
                        Awaiting generation
                      </p>
                      <p className="text-slate-400 dark:text-slate-400 text-sm font-light">
                        Your audio will appear here
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 animate-fade-in-up">
                    {/* Success Icon - Luxurious */}
                    <div className="relative mx-auto w-32 h-32">
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full blur-2xl opacity-40 animate-pulse-glow"></div>
                      <div className="relative w-full h-full bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center shadow-2xl shadow-teal-500/50">
                        <span className="text-6xl animate-bounce-gentle">
                          ✓
                        </span>
                      </div>
                    </div>

                    {/* Success Message */}
                    <div className="text-center space-y-2">
                      <h3 className="text-3xl font-light text-slate-800 dark:text-white">
                        Success
                      </h3>
                      <p className="text-slate-500 dark:text-slate-300 text-sm font-light">
                        Your voice has been generated
                      </p>
                    </div>

                    {/* Audio Player - Premium */}
                    <div className="bg-gradient-to-br from-teal-50/50 to-cyan-50/50 dark:from-slate-800/80 dark:to-slate-900/80 p-6 rounded-2xl border border-teal-200/50 dark:border-teal-700/30 shadow-inner">
                      <audio
                        controls
                        src={audioUrl}
                        className="w-full h-12 outline-none"
                      />
                    </div>

                    {/* Download Button - Elegant */}
                    <button
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href = audioUrl;
                        a.download = `tts-${selectedVoice}-${Date.now()}.mp3`;
                        a.click();
                      }}
                      className="group/dl w-full py-4 px-6 bg-white dark:bg-slate-800/90 border-2 border-teal-200 dark:border-teal-700/50 text-slate-700 dark:text-slate-100 font-semibold rounded-xl hover:bg-teal-50 dark:hover:bg-slate-700 hover:border-teal-400 dark:hover:border-teal-500 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
                    >
                      <span className="text-xl group-hover/dl:animate-bounce">
                        ⬇️
                      </span>
                      <span className="tracking-wide">Download MP3</span>
                    </button>

                    {/* Metadata */}
                    <div className="pt-6 border-t border-teal-100 dark:border-teal-800/40 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 dark:text-slate-400 font-light">
                          Voice
                        </span>
                        <span className="text-slate-600 dark:text-slate-100 font-medium">
                          {VOICES[selectedVoice].name}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400 dark:text-slate-400 font-light">
                          Characters
                        </span>
                        <span className="text-slate-600 dark:text-slate-100 font-medium">
                          {text.length}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer - Minimal */}
          <div className="text-center mt-16">
            <p className="text-slate-400 dark:text-slate-500 text-xs font-light tracking-widest">
              POWERED BY ELEVENLABS V2 • REACT • TAILWIND CSS
            </p>
          </div>
        </div>

        <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        .animate-float { animation: float 8s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-fade-in-up { animation: fadeInUp 0.7s ease-out forwards; }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.15);
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { 
          background: linear-gradient(to bottom, #14b8a6, #06b6d4);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover { 
          background: linear-gradient(to bottom, #0d9488, #0891b2);
        }
      `}</style>
      </div>
    </div>
  );
};

export default App;