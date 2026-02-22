"use client";

import {
  IconHome,
  IconBooks,
  IconLayoutGrid,
  IconChartDots2,
  IconUserEdit,
} from "@tabler/icons-react";
import Link from "next/link";
import { ROUTES } from "@/routes";
import { usePathname } from "next/navigation";

type Props = {
  hideEditBtn?: boolean;
};

export default function MiniNavBar({ hideEditBtn }: Props) {
  const pathname = usePathname();

  const navLinks = [
    {
      href: ROUTES.HOME,
      label: "home",
      icon: <IconHome aria-hidden="true" focusable="false" />,
    },
    {
      href: ROUTES.LIBRARY,
      label: "library",
      icon: <IconBooks aria-hidden="true" focusable="false" />,
    },
    {
      href: ROUTES.COLLECTIONS,
      label: "collections",
      icon: <IconLayoutGrid aria-hidden="true" focusable="false" />,
    },
    {
      href: ROUTES.STATS,
      label: "stats",
      icon: <IconChartDots2 aria-hidden="true" focusable="false" />,
    },
    {
      href: ROUTES.EDIT_PROFILE,
      label: "edit profile",
      icon: <IconUserEdit aria-hidden="true" focusable="false" />,
    },
  ];

  const getIsActive = (href: string) => {
    if (href === ROUTES.LIBRARY) {
      // Make Library active for both library route and any story routes
      return pathname === ROUTES.LIBRARY || pathname.startsWith("/story/");
    }
    // For other links, use the original logic
    return pathname === href || pathname.startsWith(href + "/");
  };

  // normal nav links (hidden between sm–lg)
  const renderDefaultNav = () => (
    <div
      role="navigation"
      aria-label="Primary navigation links"
      className="hidden items-center gap-2 sm:hidden lg:flex"
    >
      {navLinks.map(({ href, label, icon }) => {
        const isActive = getIsActive(href);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
            title={label}
            className={`myLink ${isActive ? "activeLink" : ""}`}
          >
            {icon}
            {isActive && <span className="mt-[2px] text-base">{label}</span>}
          </Link>
        );
      })}
    </div>
  );

  // edit-only nav (shown only between sm–lg)
  const renderEditOnlyNav = () => {
    if (hideEditBtn) return null;

    return (
      <div
        role="navigation"
        aria-label="Edit profile navigation"
        className="flex items-center gap-2 lg:hidden"
      >
        <Link
          href={ROUTES.EDIT_PROFILE}
          aria-label="Edit profile"
          aria-current={pathname === ROUTES.EDIT_PROFILE ? "page" : undefined}
          className="myLink activeLink"
          title="edit profile"
        >
          <IconUserEdit
            className="hidden sm:flex md:hidden"
            aria-hidden="true"
            focusable="false"
          />
          <span className="mt-[2px] flex px-1 text-sm sm:hidden md:flex">
            edit profile
          </span>
        </Link>
      </div>
    );
  };

  return (
    <div className="pb-[6px] sm:pb-1 md:pb-3 lg:pb-5" id="miniNavBar">
      <nav
        aria-label="Main interal navigation"
        className="flex items-center gap-2 text-lg font-semibold"
      >
        {renderDefaultNav()}
        {renderEditOnlyNav()}
      </nav>
    </div>
  );
}
