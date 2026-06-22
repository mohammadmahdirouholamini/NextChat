"use client";

import React, { useState } from "react";

function ImageGeneratorInput() {
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState("1024x1024");
  const [style, setStyle] = useState("realistic");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt) return;

    setLoading(true);

    try {
      const res = await fetch("/api/generate/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          size,
          style,
        }),
      });

      const data = await res.json();
      setImage(data.image);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="grid grid-cols-12 gap-6 p-6 h-screen">
      {/* LEFT - IMAGE */}
      <div className="col-span-7 flex items-center justify-center bg-gray-100 rounded-xl p-4">
        {loading && <p>درحال تولید ...</p>}

        {!loading && image && (
          <img src={image} className="rounded-xl max-h-[500px]" />
        )}

        {!loading && !image && <p className="text-gray-400">تصویر تولید شده</p>}
      </div>

      {/* RIGHT - INPUTS */}
      <div className="col-span-5 flex flex-col gap-4">
        <textarea
          className="border rounded-lg p-3 h-32"
          placeholder="متن تصویری که میخواید تولید کنید رو بنویسید ..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        {/* SIZE */}
        <select
          className="border rounded-lg p-2"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        >
          <option value="1024x1024">موبایل (1024x1024)</option>
          <option value="1536x1024">تبلت (1536x1024)</option>
        </select>

        {/* STYLE */}
        <select
          className="border rounded-lg p-2"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
        >
          <option value="realistic">واقع‌گرایانه</option>
          <option value="cartoon">کارتونی</option>
          <option value="3d render">سه بعدی</option>
          <option value="digital painting">نقاشی دیجیتال</option>
          <option value="anime style">انیمه</option>
          <option value="watercolor painting">آبرنگ</option>
          <option value="oil painting">نقاشی رنگ روغن</option>
          <option value="cyberpunk">سایبرپانک</option>
          <option value="minimalist illustration">مینیمال</option>
          <option value="fantasy art">فانتزی</option>
        </select>

        <button
          onClick={generateImage}
          className="bg-black text-white rounded-lg p-3"
        >
          تولید تصویر
        </button>
      </div>
    </div>
  );
}

export default ImageGeneratorInput;
