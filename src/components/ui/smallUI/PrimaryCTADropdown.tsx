"use client";
import React, { useState, useRef, useEffect } from "react";
import PrimaryCTA from "./PrimaryCTA";
import * as TablerIcons from "@tabler/icons-react";

type DropdownItem = {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
};

type Props = {
  text: string;
  dropdownItems: DropdownItem[];
  variant?: "fab" | "default";
  className?: string;
  mainIcon?:
    | keyof typeof TablerIcons
    | React.ComponentType<TablerIcons.IconProps>
    | React.ReactNode;
};

export default function PrimaryCTADropdown({
  text,
  dropdownItems,
  variant = "default",
  className = "",
  mainIcon,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => setIsOpen((prev) => !prev);

  const handleItemClick = (itemOnClick: () => void) => {
    itemOnClick();
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      // Focus should return to the toggle button
      const toggleButton = dropdownRef.current?.querySelector(
        'button, [role="button"]',
      );
      if (toggleButton) (toggleButton as HTMLElement).focus();
    }
  };

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const firstMenuItem = dropdownRef.current.querySelector(
        '[role="menuitem"]',
      ) as HTMLElement;
      if (firstMenuItem) {
        setTimeout(() => firstMenuItem.focus(), 100);
      }
    }
  }, [isOpen]);

  const fabItems = [...dropdownItems].reverse();

  return (
    <div
      ref={dropdownRef}
      className={
        variant === "fab"
          ? "fixed bottom-20 right-5 z-20 sm:bottom-16 sm:right-10"
          : "relative flex justify-center"
      }
      role="menu"
      aria-label={`${text} options`}
      onKeyDown={handleKeyDown}
    >
      {variant === "fab" ? (
        <div className="relative flex flex-col items-end">
          {/* Options stacked above the main FAB */}
          <div
            className={`primaryCTADropdown fabVer ${
              isOpen ? "open" : ""
            } flex flex-col items-end gap-3 pb-3 pr-1`}
            role="menu"
            aria-label={`${text} options`}
            aria-hidden={!isOpen}
            aria-expanded={isOpen}
          >
            {fabItems.map((item, index) => (
              <button
                key={item.label ?? index}
                onClick={() => handleItemClick(item.onClick)}
                className={`fabOption fabOption-${fabItems.length - index}`}
                type="button"
                role="menuitem"
                aria-label={item.label}
                title={item.label}
              >
                {item.icon}
              </button>
            ))}
          </div>

          {/* Main FAB at the bottom of the line */}
          <PrimaryCTA
            text={text}
            onClick={handleToggle}
            variant="fab"
            isFixedFab={false}
            className={className}
            aria-haspopup="menu"
            aria-expanded={isOpen}
          />
        </div>
      ) : (
        <>
          <PrimaryCTA
            text={text}
            onClick={handleToggle}
            variant={variant}
            className={className}
            aria-haspopup="menu"
            aria-expanded={isOpen}
            icon={mainIcon}
          />

          {variant === "default" && isOpen && (
            <div
              className="primaryCTADropdown defaultVer left-1/2 top-full mt-2 -translate-x-1/2 transform"
              role="menu"
              aria-label={`${text} options`}
              aria-expanded={isOpen}
            >
              {dropdownItems.map((item, index) => (
                <button
                  key={item.label ?? index}
                  onClick={() => handleItemClick(item.onClick)}
                  type="button"
                  role="menuitem"
                  aria-label={item.label}
                  title={item.label}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
