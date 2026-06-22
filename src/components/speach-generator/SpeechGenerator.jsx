"use client";

import { useState, useRef } from "react";

export default function SpeechGenerator() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("alloy");
  const [speed, setSpeed] = useState(1);
  const [format, setFormat] = useState("mp3");

  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState([]);

  const audioRef = useRef(null);

  const generateSpeech = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setAudioUrl(null);

    const res = await fetch("/api/generate/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        voice,
        speed,
        format,
      }),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    setAudioUrl(url);

    setHistory((prev) => [
      {
        text,
        url,
        voice,
        time: Date.now(),
      },
      ...prev,
    ]);

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
      <h2 className="text-xl text-slate-800 mb-6">تولید صوت</h2>

      {/* TEXT INPUT */}

      <textarea
        placeholder="متن را وارد کنید"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        style={{ width: "100%", padding: 10 }}
      />

      <br />
      <br />

      {/* CONTROLS */}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <select value={voice} onChange={(e) => setVoice(e.target.value)}>
          <option value="alloy">Alloy</option>
          <option value="verse">Verse</option>
          <option value="nova">Nova</option>
          <option value="aria">Aria</option>
        </select>

        <select value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="mp3">MP3</option>
          <option value="wav">WAV</option>
        </select>

        <div>
          سرعت
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
          />
        </div>
      </div>

      <br />

      <button
        onClick={generateSpeech}
        disabled={loading}
        className="bg-slate-900 text-gray-100 px-3 py-1.5 rounded-md hover:translate-y-0.5"
      >
        {loading ? "درحال تولید ..." : "تولید کنید"}
      </button>

      <br />
      <br />

      {audioUrl && (
        <div>
          <audio
            ref={audioRef}
            controls
            src={audioUrl}
            style={{ width: "100%" }}
          />

          <br />

          <a
            href={audioUrl}
            download={`speech.${format}`}
            className="bg-slate-900 text-gray-100 px-3 py-1.5 rounded-md"
          >
            دانلود
          </a>
        </div>
      )}

      {/* HISTORY */}

      {history.length > 0 && (
        <div style={{ marginTop: 40 }}>
          <h3>تاریخچه</h3>

          {history.map((item, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #ddd",
                padding: 10,
                marginBottom: 10,
              }}
            >
              <div style={{ fontSize: 14, marginBottom: 5 }}>
                {item.text.slice(0, 80)}...
              </div>

              <audio controls src={item.url} style={{ width: "100%" }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
