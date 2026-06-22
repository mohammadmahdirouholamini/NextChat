// app/components/sidebar/SideBar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuItems, toggleIcons } from "./menu";
import { FaHome } from "react-icons/fa";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

export function SideBar({ isCollapsed, toggleSidebar }) {
  const pathname = usePathname();
  const { isSignedIn, user: clerkUser, isLoaded } = useUser();
  console.log(clerkUser, isSignedIn, isLoaded);

  const user = {
    name: clerkUser?.fullName || "John Doe",
    email: clerkUser?.primaryEmailAddress.emailAddress || "john@example.com",
    image: clerkUser?.imageUrl || "", // Replace with your image path
  };

  return (
    <aside
      className={`bg-white shadow-md transition-all duration-300 ease-in-out flex flex-col ${
        isCollapsed ? "w-24" : "w-64"
      }`}
    >
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b">
          <Link href="/" className="hover:text-primary transition-colors">
            <FaHome
              size={30}
              className="text-gray-700 hover:text-primary mr-4"
            />
            {!isCollapsed && (
              <span className="sr-only text-stone-700">خانه</span>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? toggleIcons.expanded : toggleIcons.collapsed}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-1 p-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors mr-3 ${
                    pathname === item.path
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  } ${isCollapsed ? "justify-center" : ""}`}
                >
                  <span className="flex items-center">{item.icon}</span>
                  {!isCollapsed && <span className=" mr-3">{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div
        className={`border-t p-4 bg-white ${
          isCollapsed ? "flex justify-center" : ""
        }`}
      >
        <Link href="/dashboard/account" className="flex items-center">
          <div className="relative w-10 h-10 rounded-full overflow-hidden">
            {user?.image ? (
              <Image
                src={user?.image}
                alt="User profile"
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <div className="bg-gray-200 w-[40px] h-[40px] rounded-full flex items-center justify-center uppercase font-bold">
                {user?.name?.charAt(0)}
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="font-medium text-sm truncate">{user?.name}</p>
              <p className="text-gray-500 text-xs truncate">{user?.email}</p>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}
