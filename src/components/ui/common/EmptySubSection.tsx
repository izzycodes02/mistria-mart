"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { IconHistory, IconHeart, IconLayoutGrid } from "@tabler/icons-react";

type DropdownItem = {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
};

type Props = {
  title: string;
  icon: "Heart" | "History" | "Grid";
  description: string;

  hasButton?: boolean;
  buttonText?: string;
  buttonLink?: string;

  buttonDropdownItems?: DropdownItem[];
  buttonDropdownText?: string;
};

const ICON_MAP = {
  Heart: IconHeart,
  History: IconHistory,
  Grid: IconLayoutGrid,
};

export default function EmptySubSection({
  title,
  icon,
  description,
  hasButton,
  buttonText,
  buttonLink,
  buttonDropdownItems,
  buttonDropdownText = "Options",
}: Props) {
  const IconComponent = ICON_MAP[icon];
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const hasDropdown = buttonDropdownItems && buttonDropdownItems.length > 0;

  const headingId = `${title.toLowerCase().replace(/\s+/g, "-")}-heading`;
  const dropdownButtonId = `${headingId}-dropdown-button`;
  const dropdownMenuId = `${headingId}-dropdown-menu`;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section
      className="flex flex-col items-center justify-center gap-3.5 rounded-xl border-[1.75px] border-dashed border-bb-border-1 bg-bb-surface py-12"
      aria-labelledby={headingId}
    >
      {/* Icon */}
      <div
        className="rounded-lg border border-bb-border-1 bg-white p-2"
        aria-hidden="true"
      >
        {IconComponent && (
          <IconComponent
            size={22}
            stroke={1.5}
            aria-hidden="true"
            focusable="false"
          />
        )}
      </div>

      {/* Title */}
      <h3 id={headingId} className="text-xl font-bold">
        {title}
      </h3>

      {/* Description */}
      <p className="w-4/5 text-center text-sm sm:w-3/5">{description}</p>

      {/* CTA Area */}
      {hasDropdown ? (
        <div className="relative mt-1" ref={dropdownRef}>
          <button
            id={dropdownButtonId}
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-lg border border-bb-border-1 bg-white px-4 py-1.5 text-sm font-semibold shadow-md shadow-zinc-200 hover:bg-zinc-75 active:scale-[0.97]"
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls={dropdownMenuId}
          >
            {buttonDropdownText}
          </button>

          {/* Dropdown */}
          {open && (
            <div
              id={dropdownMenuId}
              className="primaryCTADropdown defaultVer left-1/2 top-full mt-2 -translate-x-1/2 transform"
              role="menu"
              aria-labelledby={dropdownButtonId}
            >
              {buttonDropdownItems?.map((item, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    item.onClick();
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-zinc-100"
                  role="menuitem"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : hasButton && buttonLink ? (
        <Link
          href={buttonLink}
          className="mt-1 rounded-lg border border-bb-border-1 bg-white px-4 py-1.5 text-sm font-semibold shadow-md shadow-zinc-200 hover:bg-zinc-75 active:scale-[0.97]"
        >
          {buttonText}
        </Link>
      ) : null}
    </section>
  );
}
