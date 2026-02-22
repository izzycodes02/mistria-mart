"use client";

import {
  IconMenu2,
  IconSettings,
  IconCaretDownFilled,
  IconLogout,
  IconHome,
  IconBooks,
  IconLayoutGrid,
  IconChartDots2,
} from "@tabler/icons-react";
import "@styles/navigation.scss";
import { ROUTES } from "@/routes";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export default function AppNavbarMD() {
  const router = useRouter();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsUserDropdownOpen((prev) => !prev);
  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => {
      const next = !prev;
      document.body.classList.toggle("drawer-open", next);
      return next;
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push(ROUTES.LANDING);
    router.refresh();
  };

  const handleSettings = () => {
    router.push(ROUTES.ACCOUNT_SETTINGS);
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  return (
    <div className={`tabletNav fixed left-0 top-0 z-[50] w-full`}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleDrawer}
          className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-bb-green-trans hover:text-bb-green-darker"
        >
          <IconMenu2 className="h-7 w-7" />
        </button>
        <a className="flex items-center" href={ROUTES.HOME}>
          <img src="/apple-touch-icon.png" className="h-7" alt="Bokbi Logo" />
        </a>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={toggleMenu}
          className={`myProfilePill flex gap-1 rounded-lg border border-zinc-300 px-2 py-[6px] transition duration-300 hover:bg-zinc-100 hover:shadow-sm ${
            isUserDropdownOpen ? "bg-zinc-100" : ""
          }`}
        >
          <img
            src="https://i.pinimg.com/736x/ed/f6/16/edf6162f41aa68b7c40c0291bdcf10c8.jpg"
            alt="user's avatar"
            className="h-6 rounded-full"
          />
          <IconCaretDownFilled className="w-5" />
        </button>

        {isUserDropdownOpen && (
          <div className="absolute right-0 top-11 z-[1000] w-36 rounded-lg border border-zinc-300 bg-white p-3 shadow-sm">
            <div className="userDropdown tablet">
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

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              className="fixed bottom-0 left-0 right-0 top-14 z-50 bg-black/20 backdrop-blur-[1px]"
              onClick={toggleDrawer}
              initial={{ opacity: 0.25 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.5 }}
              transition={{ duration: 0.4 }}
            />

            <motion.aside
              className="slideOutDrawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-50%" }}
              transition={{
                type: "tween",
                ease: "easeOut",
                duration: 0.2,
              }}
            >
              <div>
                <a href={ROUTES.HOME} className="home">
                  <IconHome /> <p>Home</p>
                </a>
                <a href={ROUTES.LIBRARY}>
                  <IconBooks /> <p>Library</p>
                </a>
                <a href={ROUTES.COLLECTIONS}>
                  <IconLayoutGrid /> <p>Collections</p>
                </a>
                <a href="">
                  <IconChartDots2 /> <p>Stats</p>
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
