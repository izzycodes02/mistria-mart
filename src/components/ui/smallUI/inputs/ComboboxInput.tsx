"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  IconChevronDown,
  IconSearch,
  IconPlus,
  IconX,
} from "@tabler/icons-react";

type Option = {
  id: string | number;
  label: string;
  value: string;
  isCustom?: boolean;
};

type Props = {
  label: string;
  data: Option[];
  required?: boolean;
  variant: "row" | "col";
  helperText?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: Option) => void;
  beLowerCased?: boolean;
};

export default function ComboBoxInput({
  label,
  data,
  required,
  variant,
  helperText,
  placeholder = "Search or add...",
  onChange,
  value,
  beLowerCased,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const [selected, setSelected] = useState<Option | null>(
    data.find((opt) => opt.value === value) || null,
  );
  const ref = useRef<HTMLDivElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Filter existing options
  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    return data.filter((opt) =>
      opt.label.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, data]);

  // Check if current query is a custom (nonexistent) option
  const isCustomEntry =
    query.trim().length > 0 &&
    !data.some((opt) => opt.label.toLowerCase() === query.trim().toLowerCase());

  const handleSelect = (option: Option) => {
    setSelected(option);
    setQuery(option.label);
    setOpen(false);
    onChange?.(option);
  };

  const handleAddCustom = () => {
    const newOption: Option = {
      id: `custom-${Date.now()}`,
      label: query.trim(),
      value: query.trim(),
      isCustom: true,
    };
    setSelected(newOption);
    setOpen(false);
    onChange?.(newOption);
  };

  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(null);
    setQuery("");
    setOpen(false);
    onChange?.({ id: "", label: "", value: "" } as Option);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      const matched = data.find((opt) => opt.value === value);
      setSelected(matched || null);
      setQuery(matched?.label || value);
    } else {
      setSelected(null);
      setQuery("");
    }
  }, [value, data]);

  useEffect(() => {
    if (open) {
      setHighlightedIndex(-1);
      optionRefs.current = [];
    }
  }, [open, filtered]);

  useEffect(() => {
    if (highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [highlightedIndex]);

  const hasSelection = selected && selected.value !== "";

  return (
    <div
      className={`flex ${
        variant === "row" ? "flex-row items-center gap-3" : "w-full flex-col"
      }`}
    >
      <label className="text-sm font-semibold">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {helperText && <p className="mb-1 text-xs text-zinc-400">{helperText}</p>}

      <div ref={ref} className="relative w-full">
        <div
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls="combobox-options"
          className={`flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm shadow-sm outline-none transition-all focus-within:border-[var(--secondary)] focus-within:ring-2 focus-within:ring-[var(--secondary)] hover:border-[var(--secondary)]`}
        >
          <div className="flex w-full items-center gap-2">
            <IconSearch
              size={16}
              stroke={1.75}
              className="text-[var(--secondary)]"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!open) setOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (
                    highlightedIndex >= 0 &&
                    highlightedIndex < filtered.length
                  ) {
                    handleSelect(filtered[highlightedIndex]);
                  } else if (isCustomEntry) {
                    handleAddCustom();
                  } else if (filtered.length === 1) {
                    handleSelect(filtered[0]);
                  }
                } else if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setOpen(true);
                  const nextIndex =
                    highlightedIndex < filtered.length - 1
                      ? highlightedIndex + 1
                      : 0;
                  setHighlightedIndex(nextIndex);
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setOpen(true);
                  const nextIndex =
                    highlightedIndex > 0
                      ? highlightedIndex - 1
                      : filtered.length - 1;
                  setHighlightedIndex(nextIndex);
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  setOpen(false);
                  setHighlightedIndex(-1);
                } else if (
                  (e.key === "Delete" || e.key === "Backspace") &&
                  hasSelection &&
                  query === selected?.label
                ) {
                  e.preventDefault();
                  handleClearSelection(e as any);
                }
              }}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              aria-autocomplete="list"
              aria-controls="combobox-options"
              aria-activedescendant={
                highlightedIndex >= 0 && filtered[highlightedIndex]
                  ? `option-${filtered[highlightedIndex].id}`
                  : undefined
              }
              className="w-full bg-transparent outline-none placeholder:text-zinc-400"
            />
          </div>

          <div className="flex items-center gap-1">
            {hasSelection && (
              <IconX
                size={16}
                stroke={2}
                className="h-4 w-4 cursor-pointer rounded-sm text-zinc-400 transition duration-200 hover:text-zinc-600"
                onClick={handleClearSelection}
                title="Clear selection"
                aria-label="Clear selection"
              />
            )}
            <IconChevronDown
              size={18}
              stroke={1.75}
              className={`ml-2 shrink-0 text-bb-text transition-transform ${
                open ? "rotate-180" : ""
              }`}
              onClick={() => setOpen((prev) => !prev)}
            />
          </div>
        </div>

        {/* Dropdown */}
        {open && (
          <div
            id="combobox-options"
            role="listbox"
            aria-label={`${label} options`}
            className="absolute left-0 right-0 z-20 mt-2 rounded-lg border border-zinc-200 bg-white p-1.5 shadow-lg"
          >
            {filtered.length > 0 || isCustomEntry ? (
              <ul className="custom-scroll max-h-[150px] overflow-y-scroll pr-1.5">
                {filtered.map((option, index) => (
                  <li
                    key={option.id}
                    ref={(el) => {
                      optionRefs.current[index] = el;
                    }}
                    id={`option-${option.id}`}
                    role="option"
                    aria-selected={
                      selected?.id === option.id || highlightedIndex === index
                    }
                    onClick={() => handleSelect(option)}
                    className={`mb-1 cursor-pointer rounded-md border border-white p-1 px-1.5 text-sm last:mb-0 hover:border-[var(--secondary-trans)] hover:bg-[var(--secondary-trans-2)] ${
                      selected?.id === option.id
                        ? "border-[var(--secondary-trans)] bg-[var(--secondary-trans-2)] font-semibold text-[var(--secondary)]"
                        : highlightedIndex === index
                          ? "border-[var(--secondary)] bg-[var(--secondary-trans-2)]"
                          : ""
                    }`}
                  >
                    {beLowerCased ? (
                      <span>
                        ({option.label.toLowerCase()})
                      </span>
                    ) : (
                      option.label
                    )}
                  </li>
                ))}

                {/* Custom new option */}
                {isCustomEntry && (
                  <li
                    ref={(el) => {
                      optionRefs.current[filtered.length] = el;
                    }}
                    role="option"
                    aria-selected={highlightedIndex === filtered.length}
                    aria-label={`Add custom option: ${query.trim()}`}
                    onClick={handleAddCustom}
                    className={`flex cursor-pointer items-center gap-2 rounded-md border p-1 px-1.5 text-sm ${
                      highlightedIndex === filtered.length
                        ? "border-[var(--secondary)] bg-[var(--secondary-trans)] font-semibold text-[var(--secondary)]"
                        : "border-[var(--secondary-trans)] bg-[var(--secondary-trans-2)] text-[var(--secondary)] hover:bg-[var(--secondary-trans)]"
                    }`}
                  >
                    <IconPlus size={14} stroke={2} />
                    Add "{query.trim()}"
                  </li>
                )}
              </ul>
            ) : (
              <div className="px-2 py-1.5 text-sm text-zinc-500">
                No results found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Custom Scrollbar */}
      <style jsx>{`
        .custom-scroll {
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
          padding-right: 4px;
        }
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 9999px;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.45);
        }
        .custom-scroll::-webkit-scrollbar-button {
          display: none;
        }
      `}</style>
    </div>
  );
}
