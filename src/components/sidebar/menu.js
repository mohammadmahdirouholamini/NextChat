// app/components/sidebar/menu.js
import { FaTh, FaDollarSign, FaCog } from "react-icons/fa";
import { LuImageOff } from "react-icons/lu";
import { LuImagePlus } from "react-icons/lu";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { RxSpeakerLoud } from "react-icons/rx";
import { FaSpeakap } from "react-icons/fa6";
import { IoChatboxOutline } from "react-icons/io5";
import { FaUsersGear } from "react-icons/fa6";
import { BiUserCircle } from "react-icons/bi";
import { MdManageHistory, MdOndemandVideo } from "react-icons/md";
import { IoVideocamOutline } from "react-icons/io5";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

export const menuItems = [
  {
    title: "داشبورد",
    icon: <FaTh size={18} />,
    path: "/dashboard",
  },
  {
    title: "چت",
    icon: <IoChatboxOutline size={18} />,
    path: "/dashboard/ai-chat",
  },
  {
    title: "تولید تصویر",
    icon: <LuImagePlus size={18} />,
    path: "/dashboard/image-generator",
  },
  {
    title: "تولید صوت",
    icon: <RxSpeakerLoud size={18} />,
    path: "/dashboard/speach-generator",
  },
  {
    title: "صوت به متن",
    icon: <FaSpeakap size={18} />,
    path: "/dashboard/speach-to-text-generator",
  },

];

export const toggleIcons = {
  expanded: <FiChevronLeft size={20} />,
  collapsed: <FiChevronRight size={20} />,
};
