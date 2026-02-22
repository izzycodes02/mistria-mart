"use client";

import { useState, useRef, useEffect, useMemo, KeyboardEvent } from "react";
import { IconChevronDown } from "@tabler/icons-react";

type Option = string | { label: string; value: string };

type Props = {
  label: string;
  data: Option[];
  required?: boolean;
  variant: "row" | "col";
  helperText?: string;
  defaultIndex?: number;
  value?: string;
  onChange?: (value: string) => void;
};

export default function SelectInput({
  label,
  data,
  required,
  variant,
  helperText,
  defaultIndex,
  onChange,
  value,
}: Props) {
  const options = useMemo(
    () =>
      data.map((item) =>
        typeof item === "string" ? { label: item, value: item } : item,
      ),
    [data],
  );

  const [open, setOpen] = useState(false);
  const selectedOption =
    options.find((opt) => opt.value === value) ??
    options[defaultIndex ?? 0] ??
    options[0];

  const ref = useRef<HTMLDivElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(defaultIndex ?? 0);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Set highlighted index to current selection when opening
  useEffect(() => {
    if (open) {
      const selectedIndex = options.findIndex(
        (opt) => opt.value === selectedOption.value,
      );
      setHighlightedIndex(selectedIndex !== -1 ? selectedIndex : 0);
      optionRefs.current = []; // Reset refs array
    }
  }, [open, options, selectedOption.value]);

  // Scroll to highlighted item
  useEffect(() => {
    if (open && highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [open, highlightedIndex]);

  const handleSelect = (option: { label: string; value: string }) => {
    setOpen(false);
    onChange?.(option.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    // Prevent default scrolling behavior for space and arrow keys
    if ([" ", "ArrowUp", "ArrowDown", "Enter"].includes(e.key)) {
      e.preventDefault();
    }

    switch (e.key) {
      case "Enter":
      case " ": // Space key
        if (open) {
          // Select the highlighted item
          if (highlightedIndex >= 0 && options[highlightedIndex]) {
            handleSelect(options[highlightedIndex]);
          }
        } else {
          // Open the dropdown
          setOpen(true);
        }
        break;

      case "ArrowDown":
        setOpen(true); // Open if not already
        setHighlightedIndex((prev) => {
          const nextIndex = prev + 1;
          return nextIndex >= options.length ? 0 : nextIndex;
        });
        break;

      case "ArrowUp":
        setOpen(true); // Open if not already
        setHighlightedIndex((prev) => {
          const nextIndex = prev - 1;
          return nextIndex < 0 ? options.length - 1 : nextIndex;
        });
        break;

      case "Escape":
        setOpen(false);
        break;
    }
  };

  return (
    <div
      className={`flex ${
        variant === "row" ? "flex-row items-center gap-3" : "w-full flex-col"
      }`}
    >
      <label id={`select-label-${label}`} className="text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {helperText && (
        <p className="-mt-1 mb-1 text-xs text-zinc-500">{helperText}</p>
      )}

      <div ref={ref} className="relative w-full">
        {/* Select Box */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls="select-options"
          aria-labelledby={`select-label-${label}`}
          aria-activedescendant={
            open && highlightedIndex >= 0 && options[highlightedIndex]
              ? `option-${options[highlightedIndex].value}`
              : undefined
          }
          className={`flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 pt-[7px] text-sm shadow-sm outline-none transition-all focus-within:border-[var(--secondary)] hover:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)] ${
            open
              ? "shadow-lg shadow-[var(--secondary)] ring-2 ring-[var(--secondary)]"
              : ""
          }`}
        >
          <span >{selectedOption.label}</span>
          <IconChevronDown
            size={18}
            stroke={1.75}
            className={`transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        {/* Dropdown */}
        {open && (
          <div
            id="select-options"
            role="listbox"
            aria-labelledby={`select-label-${label}`}
            aria-required={required}
            className="absolute right-0 z-20 mt-2 w-full rounded-lg border border-zinc-200 bg-white p-1.5 shadow-lg"
          >
            <ul className="[&::-webkit-scrollbar]:w-1.S5 max-h-[120px] w-full overflow-y-auto bg-white pr-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-white">
              {options.map((option, i) => (
                <li
                  key={option.value}
                  ref={(el) => {
                    optionRefs.current[i] = el;
                  }}
                  id={`option-${option.value}`}
                  role="option"
                  aria-selected={selectedOption.value === option.value}
                  aria-current={highlightedIndex === i ? "true" : "false"}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(i)}
                  className={`mb-1 cursor-pointer rounded-md border p-1 px-1.5 text-sm last:mb-0 hover:border-[var(--secondary-trans)] hover:bg-[var(--secondary-trans-2)] ${
                    selectedOption.value === option.value
                      ? "border-[var(--secondary-trans)] bg-[var(--secondary-trans-2)] font-medium"
                      : "border-white"
                  } ${
                    highlightedIndex === i
                      ? "border-[var(--secondary-trans)] bg-[var(--secondary-trans-2)]"
                      : ""
                  }`}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
