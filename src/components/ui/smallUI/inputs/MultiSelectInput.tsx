"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import * as TablerIcons from "@tabler/icons-react";
import {
  IconChevronDown,
  IconSearch,
  IconX,
  IconPlus,
  IconCheck,
} from "@tabler/icons-react";

export type Option = {
  label: string;
  value: string;
  id: string | number;
  isCustom?: boolean;
  icon?: keyof typeof TablerIcons;
};

type Props = {
  label: string;
  data: Option[];
  value?: Option[];
  helperText?: string;
  placeholder?: string;
  variant?: "row" | "col";
  icon?: keyof typeof TablerIcons;
  hoverIcon?: keyof typeof TablerIcons;
  onChange?: (selected: Option[]) => void;
  beLowerCased?: boolean;
};

export default function MultiSelectInput({
  label,
  data,
  icon,
  value,
  hoverIcon,
  onChange,
  helperText,
  variant = "col",
  placeholder = "Search or add...",
  beLowerCased,
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Option[]>(value || []);
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const filtered = useMemo(() => {
    if (!query.trim()) return data;
    return data.filter((opt) =>
      opt.label.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, data]);

  const isCustomEntry =
    query.trim().length > 0 &&
    !data.some((opt) => opt.label.toLowerCase() === query.trim().toLowerCase());

  const toggleSelect = (option: Option) => {
    let newSelected;
    if (selected.some((s) => s.id === option.id)) {
      newSelected = selected.filter((s) => s.id !== option.id);
    } else {
      newSelected = [...selected, option];
    }
    setSelected(newSelected);
    setOpen(false); 
    setQuery(""); 
    onChange?.(newSelected);
  };

  const handleAddCustom = () => {
    const newOption: Option = {
      id: `custom-${Date.now()}`,
      label: query.trim(),
      value: query.trim().toLowerCase(),
      isCustom: true,
    };
    const newSelected = [...selected, newOption];
    setSelected(newSelected);
    setQuery("");
    setOpen(false);
    onChange?.(newSelected);
  };

  const handleRemove = (id: string | number) => {
    const newSelected = selected.filter((s) => s.id !== id);
    setSelected(newSelected);
    onChange?.(newSelected);
  };

  const handleClearAll = () => {
    setSelected([]);
    onChange?.([]);
  };

  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuery("");
  };

  const IconComponent =
    icon && TablerIcons[icon]
      ? (TablerIcons[icon] as React.FC<{
          size?: number;
          stroke?: number;
          className?: string;
        }>)
      : null;

  const HoverIconComponent =
    hoverIcon && TablerIcons[hoverIcon]
      ? (TablerIcons[hoverIcon] as React.FC<{
          size?: number;
          stroke?: number;
          className?: string;
        }>)
      : null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) setSelected(value);
  }, [value]);

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

  return (
    <div
      className={`flex ${
        variant === "row" ? "flex-row items-center gap-3" : "w-full flex-col"
      }`}
    >
      <label className="text-sm font-semibold">{label}</label>
      {helperText && (
        <p className="-mt-1 mb-1 text-xs text-zinc-500">{helperText}</p>
      )}

      <div ref={ref} className="relative w-full">
        <div
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls="multiselect-options"
          aria-multiselectable="true"
          className={`flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm shadow-sm outline-none transition-all focus-within:ring-2 focus-within:ring-[var(--secondary)] hover:border-[var(--secondary)]`}
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
                setHighlightedIndex(-1);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (
                    highlightedIndex >= 0 &&
                    highlightedIndex < filtered.length
                  ) {
                    toggleSelect(filtered[highlightedIndex]);
                  } else if (isCustomEntry) {
                    handleAddCustom();
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
                }
              }}
              onFocus={() => setOpen(true)}
              placeholder={placeholder}
              aria-autocomplete="list"
              aria-controls="multiselect-options"
              aria-activedescendant={
                highlightedIndex >= 0 && filtered[highlightedIndex]
                  ? `option-${filtered[highlightedIndex].id}`
                  : undefined
              }
              className="w-full bg-transparent outline-none placeholder:text-zinc-400"
            />
          </div>

          {/* Clear All Button */}
          {query.length > 0 && (
            <IconX
              size={16}
              stroke={2}
              className="ml-2 h-full w-5 cursor-pointer rounded-sm text-zinc-400 transition duration-200 hover:text-zinc-600"
              onClick={handleClearSelection}
              title="Clear all selections"
              aria-label="Clear all selections"
            />
          )}

          <IconChevronDown
            size={18}
            stroke={1.75}
            className={`ml-2 shrink-0 text-bb-text transition-transform ${
              open ? "rotate-180" : ""
            }`}
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close options" : "Open options"}
          />
        </div>

        {/* Dropdown */}
        {open && (
          <div
            id="multiselect-options"
            role="listbox"
            aria-label={`${label} options`}
            className="absolute left-0 right-0 z-20 mt-2 rounded-lg border border-zinc-200 bg-white p-1.5 shadow-lg"
          >
            {filtered.length > 0 || isCustomEntry ? (
              <ul className="max-h-[120px] w-full overflow-y-auto bg-white pr-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar]:w-1.5">
                {filtered.map((option, index) => {
                  const isChecked = selected.some((s) => s.id === option.id);
                  const isHighlighted = highlightedIndex === index;
                  return (
                    <li
                      key={option.id}
                      ref={(el) => {
                        optionRefs.current[index] = el;
                      }}
                      id={`option-${option.id}`}
                      role="option"
                      aria-selected={isChecked}
                      onClick={() => toggleSelect(option)}
                      className={`mb-1 flex cursor-pointer items-center gap-2 rounded-md border p-1.5 text-sm last:mb-0 hover:border-[var(--secondary-trans)] hover:bg-[var(--secondary-trans-2)] ${
                        isHighlighted
                          ? "border-[var(--secondary-trans)] bg-[var(--secondary-trans-2)]"
                          : "border-white"
                      }`}
                    >
                      <div
                        className={`flex h-3 w-3 items-center justify-center rounded-sm border ${
                          isChecked
                            ? "border-[var(--secondary)] bg-[var(--secondary)] text-white"
                            : "border-zinc-300 bg-white"
                        }`}
                      >
                        {isChecked && <IconCheck size={9} stroke={3} />}
                      </div>
                      {beLowerCased ? (
                        <span>{option.label.toLowerCase()}</span>
                      ) : (
                        option.label
                      )}
                    </li>
                  );
                })}

                {isCustomEntry && (
                  <li
                    ref={(el) => {
                      optionRefs.current[filtered.length] = el;
                    }}
                    id={`option-custom-${query.trim()}`}
                    role="option"
                    aria-selected={false}
                    onClick={handleAddCustom}
                    className={`mt-1 flex cursor-pointer items-center gap-2 rounded-md border p-1.5 text-sm ${
                      highlightedIndex === filtered.length
                        ? "border-[var(--secondary-trans)] bg-[var(--secondary-trans)] text-white"
                        : "border-[var(--secondary-trans)] bg-[var(--secondary-trans-2)] text-[var(--secondary)] hover:bg-[var(--secondary-trans)]"
                    }`}
                  >
                    <IconPlus size={14} stroke={2} />
                    Add “{query.trim()}”
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

      {/* Selected Items */}
      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {/* The clear all button */}
          <button
            type="button"
            onClick={handleClearAll}
            className="hover:bg-[var(--secondary-trans) flex cursor-pointer items-center gap-1 rounded-md border border-white bg-rose-100 px-2 py-1 text-xs text-bb-text transition hover:border-rose-300"
          >
            <IconX size={14} stroke={2} className="text-rose-500" />
            <span>Clear All</span>
          </button>

          {selected.map((item) => (
            <div
              key={item.id}
              onClick={() => handleRemove(item.id)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="flex cursor-pointer items-center gap-1 rounded-md border border-white bg-[var(--secondary-trans-2)] px-3 py-1 pl-2 text-xs text-bb-text transition hover:border-[var(--secondary)] hover:bg-[var(--secondary-trans)]"
            >
              {hoveredId === item.id && HoverIconComponent ? (
                <HoverIconComponent
                  size={12}
                  stroke={1.75}
                  className="text-[var(--secondary)]"
                />
              ) : IconComponent ? (
                <IconComponent
                  size={12}
                  stroke={1.75}
                  className="text-[var(--secondary)]"
                />
              ) : null}
              {beLowerCased ? (
                <span>{item.label.toLowerCase()}</span>
              ) : (
                item.label
              )}
            </div>
          ))}
        </div>
      )}

      {/* Scrollbar styling */}
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
