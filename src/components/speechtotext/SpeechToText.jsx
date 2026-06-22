"use client";

import { useState, useRef } from "react";

export default function SpeechToText() {
  const [file, setFile] = useState(null);
  const [audioPreview, setAudioPreview] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  const handleUpload = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setAudioPreview(URL.createObjectURL(selected));
    setText("");
    setError(null);
  };

  const transcribe = async (audioFile) => {
    if (!audioFile) return;

    setLoading(true);
    setError(null);
    setText("");

    const formData = new FormData();
    formData.append("file", audioFile);

    try {
      const res = await fetch("/api/generate/transcription", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Transcription failed");
      }

      setText(data.text);

      setHistory((prev) => [
        {
          text: data.text,
          date: new Date().toLocaleString(),
        },
        ...prev,
      ]);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  const startRecording = async () => {
    setError(null);

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    mediaRecorder.current = new MediaRecorder(stream);

    mediaRecorder.current.ondataavailable = (e) => {
      chunks.current.push(e.data);
    };

    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      chunks.current = [];

      setAudioPreview(URL.createObjectURL(blob));
      transcribe(blob);
    };

    mediaRecorder.current.start();
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transcription.txt";
    a.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">صوت به متن</h1>
        <p className="text-gray-500 text-sm">فایل صوتی رو به متن تبدیل کنید </p>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
        <div className="flex flex-col gap-4">
          <input
            type="file"
            accept="audio/*"
            placeholder="فایلی انتخاب کنید"
            onChange={handleUpload}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />

          {audioPreview && (
            <audio controls src={audioPreview} className="w-full" />
          )}

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => transcribe(file)}
              disabled={!file || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg
                         hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "درحال تبدیل" : "فایل متنی"}
            </button>

            <button
              onClick={startRecording}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              شروع ضبط
            </button>

            <button
              onClick={stopRecording}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              توقف
            </button>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
        </div>
      </div>

      {text && (
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">متن تولید شده</h2>

          <textarea
            value={text}
            readOnly
            rows={6}
            className="w-full border rounded-lg p-3 text-sm"
          />

          <div className="flex gap-3">
            <button
              onClick={() => navigator.clipboard.writeText(text)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
            >
              کپی
            </button>

            <button
              onClick={downloadText}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              دانلود تکست
            </button>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">تاریخچه</h2>

          {history.map((item, index) => (
            <div
              key={index}
              className="border rounded-lg p-3 text-sm bg-gray-50"
            >
              <div className="text-xs text-gray-400 mb-1">{item.date}</div>
              {item.text.slice(0, 200)}...
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
