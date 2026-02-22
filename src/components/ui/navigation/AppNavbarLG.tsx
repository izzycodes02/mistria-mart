"use client";

import "@styles/navigation.scss";
import { ROUTES } from "@/routes";
import {
  IconCaretDownFilled,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/utils/supabase/client";

export default function AppNavbarLG() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push(ROUTES.LANDING);
    router.refresh();
  };

  const handleSettings = () => {
    router.push(ROUTES.ACCOUNT_SETTINGS);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="flex h-11 w-full items-center justify-between border-b border-border1 bg-white px-4 py-2">
      {/* Left side */}
      <a className="flex items-center gap-2" href={ROUTES.HOME}>
        <img src="/apple-touch-icon.png" className="h-6" alt="Bokbi logo" />
        <p className="pt-[3px] text-lg font-extrabold text-bb-green-darker">
          Bokbi
        </p>
      </a>

      {/* Right side */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={toggleMenu}
          className={`myProfilePill flex items-center gap-1 rounded-lg border border-zinc-200 px-2 py-[3.5px] transition duration-300 hover:bg-zinc-75 hover:shadow-sm ${isOpen ? "bg-zinc-75" : ""}`}
        >
          <img
            // The real avatar will go here, pulled from database
            src="https://i.pinimg.com/736x/ed/f6/16/edf6162f41aa68b7c40c0291bdcf10c8.jpg"
            alt="user's avatar"
            className="h-5 rounded-full"
          />
          <IconCaretDownFilled className="w-4.5" />
        </button>

        {/* The Dropdown */}
        {isOpen && (
          <div className="absolute right-0 top-9 z-[1000] w-34 rounded-lg border border-zinc-200 bg-white p-2 shadow-sm shadow-zinc-200">
            <div className="userDropdown">
              <button type="button" onClick={handleSettings}>
                <IconSettings /> <p>Settings</p>
              </button>
              <button type="button" onClick={handleSignOut} className="logOut">
                <IconLogout /> <p>Log Out</p>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
