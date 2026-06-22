"use client";

import Link from "next/link";
import { IoChatboxOutline } from "react-icons/io5";
import { LuImagePlus } from "react-icons/lu";
import { RxSpeakerLoud } from "react-icons/rx";
import { FaSpeakap } from "react-icons/fa";

const cards = [
  {
    title: "چت با هوش مصنوعی",
    description: "گفتگوی هوشمند و دستیار متنی",
    icon: <IoChatboxOutline className="w-8 h-8 text-blue-500" />,
    path: "/dashboard/ai-chat",
    bg: "hover:border-blue-500",
  },
  {
    title: "تولید تصویر",
    description: "تبدیل متن به تصاویر هنری خیره‌کننده",
    icon: <LuImagePlus className="w-8 h-8 text-purple-500" />,
    path: "/dashboard/image-generator",
    bg: "hover:border-purple-500",
  },
  {
    title: "تولید صوت (TTS)",
    description: "تبدیل متن به گفتار با صدای طبیعی",
    icon: <RxSpeakerLoud className="w-8 h-8 text-green-500" />,
    path: "/dashboard/speach-generator",
    bg: "hover:border-green-500",
  },
  {
    title: "صوت به متن (STT)",
    description: "تبدیل فایل‌های صوتی به متن دقیق",
    icon: <FaSpeakap className="w-8 h-8 text-orange-500" />,
    path: "/dashboard/speach-to-text-generator",
    bg: "hover:border-orange-500",
  },
];

export default function DashboardHome() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">پیشخوان کاربری</h1>
        <p className="text-gray-500">
          سرویس مورد نظر خود را برای شروع انتخاب کنید
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Link
            key={index}
            href={card.path}
            className={`group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm 
                       transition-all duration-300 hover:shadow-xl hover:-translate-y-2 
                       ${card.bg} flex flex-col gap-4`}
          >
            <div className="bg-gray-50 p-3 rounded-xl w-fit group-hover:scale-110 transition-transform">
              {card.icon}
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{card.description}</p>
            </div>

            <div className="mt-auto text-sm font-medium text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
              شروع کنید ←
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
