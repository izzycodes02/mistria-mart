"use client";

import { useState, useRef, useEffect } from "react";
import {
  IconCalendar,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";

type Props = {
  label: string;
  value?: string;
  required?: boolean;
  variant?: "row" | "col";
  helperText?: string;
  autoFillToday?: boolean;
  onChange?: (value: string) => void;
  error?: string | null;
};

export function ValidationBox({
  message,
  id,
}: {
  message: string | null;
  id?: string;
}) {
  if (!message) return null;
  return (
    <section
      id={id}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="validationBox normal modal"
    >
      <p>{message}</p>
    </section>
  );
}

export default function DatePickerInput({
  label,
  value,
  required,
  variant = "col",
  helperText,
  autoFillToday,
  onChange,
  error,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const errorId = `${label.replace(/\s+/g, "-").toLowerCase()}-error`;

  // Split current value
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const selectedMonthRef = useRef<HTMLLIElement>(null);
  const selectedYearRef = useRef<HTMLLIElement>(null);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Initialize from value
  useEffect(() => {
    if (!value) return; // skip if empty

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [y, m, d] = value.split("-");
      // only update if different to avoid extra renders
      if (y !== year || m !== month || d !== day) {
        setYear(y);
        setMonth(m);
        setDay(d);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Auto-fill today's date
  useEffect(() => {
    if (!autoFillToday) return;
    if (value) return; // user already passed a value, don't override
    const today = new Date();
    const y = String(today.getFullYear());
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");

    setYear(y);
    setMonth(m);
    setDay(d);

    onChange?.(`${y}-${m}-${d}`);
  }, []); 

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync combined value
  useEffect(() => {
    // If all parts are empty, propagate an empty value
    if (!year && !month && !day) {
      if (value !== "") onChange?.("");
      return;
    }

    // If only some fields are filled, don't emit a partial invalid date yet
    if (!year || !month || !day) {
      return;
    }

    // Now we know all 3 parts exist → format the date
    const formatted = `${year}-${month}-${day}`;

    // Only update if the value actually changed
    if (formatted !== value) {
      onChange?.(formatted);
    }
  }, [year, month, day, value, onChange]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;

      const clickedInsideDatepicker = ref.current?.contains(target);
      const clickedMonthDropdown = monthDropdownRef.current?.contains(target);
      const clickedYearDropdown = yearDropdownRef.current?.contains(target);

      // 1. Clicking completely outside -> close everything
      if (!clickedInsideDatepicker) {
        setOpen(false);
        setMonthDropdownOpen(false);
        setYearDropdownOpen(false);
        return;
      }

      // 2. Clicking inside the datepicker but NOT in dropdowns -> close them
      if (
        clickedInsideDatepicker &&
        !clickedMonthDropdown &&
        !clickedYearDropdown
      ) {
        setMonthDropdownOpen(false);
        setYearDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Scroll to selected month when opening
  useEffect(() => {
    if (monthDropdownOpen && selectedMonthRef.current) {
      selectedMonthRef.current.scrollIntoView({
        behavior: "instant",
        block: "center",
      });
    }
  }, [monthDropdownOpen]);

  // Scroll to selected year when opening
  useEffect(() => {
    if (yearDropdownOpen && selectedYearRef.current) {
      selectedYearRef.current.scrollIntoView({
        behavior: "instant",
        block: "center",
      });
    }
  }, [yearDropdownOpen]);

  // Update view date when year or month changes
  useEffect(() => {
    if (!open) return;

    const yNum = parseInt(year || "", 10);
    const mNum = parseInt(month || "", 10);

    if (!Number.isNaN(yNum) && !Number.isNaN(mNum) && mNum >= 1 && mNum <= 12) {
      setViewDate(new Date(yNum, mNum - 1, 1));
    }
  }, [open, year, month]);

  const currentMonth = new Date();
  const [viewDate, setViewDate] = useState(currentMonth);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const yearVal = viewDate.getFullYear();
  const monthVal = viewDate.getMonth();
  const daysInMonth = new Date(yearVal, monthVal + 1, 0).getDate();
  const startDay = new Date(yearVal, monthVal, 1).getDay();

  const handleSelect = (d: number) => {
    setYear(String(yearVal));
    setMonth(String(monthVal + 1).padStart(2, "0"));
    setDay(String(d).padStart(2, "0"));
    setOpen(false);
  };

  return (
    <div
      className={`flex ${variant === "row" ? "flex-row items-center gap-3" : "w-full flex-col"}`}
      role="group"
      aria-labelledby={`datepicker-label-${label.replace(/\s+/g, "-").toLowerCase()}`}
    >
      <label
        id={`datepicker-label-${label.replace(/\s+/g, "-").toLowerCase()}`}
        className="text-sm font-semibold"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {helperText && <p className="mb-1 text-xs text-zinc-400">{helperText}</p>}

      <div ref={ref} className="relative w-full">
        {/* Input row */}
        <div
          role="application"
          aria-label="Date picker"
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-sm shadow-sm transition-all focus-within:ring-2 focus-within:ring-[var(--secondary)] hover:border-[var(--secondary)] ${error && "inputError focus-within:border-red-300 hover:border-red-300 focus:ring-red-300"}`}
        >
          <div className="flex w-full items-center justify-between gap-1">
            <IconCalendar
              size={16}
              stroke={1.75}
              className="mr-1 text-[var(--secondary)]"
              aria-hidden="true"
            />

            {/* Year */}
            <button
              type="button"
              onClick={() => {
                setOpen(true);
                setMonthDropdownOpen(false);
                setYearDropdownOpen(true);
              }}
              aria-label="Select year"
              className="w-[3.3rem] bg-transparent text-center text-sm outline-none hover:text-[var(--secondary)] focus:ring-[var(--secondary)] focus-visible:rounded focus-visible:outline-none focus-visible:ring-2"
            >
              {year || "yyyy"}
            </button>
            <span className="text-zinc-400">/</span>

            {/* Month */}
            <button
              type="button"
              onClick={() => {
                setOpen(true);
                setMonthDropdownOpen(true);
                setYearDropdownOpen(false);
              }}
              aria-label="Select month"
              className="w-[2rem] bg-transparent text-center text-sm outline-none hover:text-[var(--secondary)] focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)]"
            >
              {month || "mm"}
            </button>
            <span className="text-zinc-400">/</span>

            {/* Day */}
            <button
              type="button"
              onClick={() => {
                setOpen(true);
                setMonthDropdownOpen(false);
                setYearDropdownOpen(false);
              }}
              aria-label="Select day"
              className="w-[2rem] bg-transparent text-center text-sm outline-none hover:text-[var(--secondary)] focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)]"
            >
              {day || "dd"}
            </button>

            <button
              type="button"
              aria-label={open ? "Close calendar" : "Open calendar"}
              aria-expanded={open}
              aria-controls="calendar-dropdown"
              className="ml-1 rounded focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
              onClick={() => {
                setOpen((prev) => !prev);
                setMonthDropdownOpen(false);
                setYearDropdownOpen(false);
              }}
            >
              <IconChevronDown
                size={18}
                stroke={1.75}
                className={`cursor-pointer text-[var(--secondary)] transition-transform ${
                  open ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {/* Calendar dropdown */}
        {open && (
          <div
            id="calendar-dropdown"
            role="dialog"
            aria-label="Calendar"
            aria-modal="true"
            className="absolute left-0 right-0 z-20 mt-2 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg"
          >
            {/* Calendar Header */}
            <div className="mb-2 flex items-center justify-between">
              {/* Previous Month */}
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => {
                  setViewDate(new Date(yearVal, monthVal - 1, 1));
                  setMonthDropdownOpen(false);
                  setYearDropdownOpen(false);
                }}
                className="rounded text-sm text-zinc-500 hover:text-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
              >
                <IconChevronLeft size={18} stroke={1.75} aria-hidden="true" />
              </button>

              {/* Month + Year Selectors */}
              <div className="flex items-center gap-2">
                {/* Year Dropdown */}
                <div className="relative" ref={yearDropdownRef}>
                  <button
                    type="button"
                    aria-label={`Select year, currently ${yearVal}`}
                    aria-expanded={yearDropdownOpen}
                    aria-controls="year-dropdown"
                    onClick={() => {
                      setYearDropdownOpen((prev) => !prev);
                      setMonthDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between rounded-md border border-zinc-200 bg-white px-2 py-1 pr-1 text-sm shadow-sm transition-all hover:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)] ${
                      yearDropdownOpen ? "ring-2 ring-[var(--secondary)]" : ""
                    }`}
                  >
                    <span>{yearVal}</span>
                    <IconChevronDown
                      size={15}
                      stroke={1.75}
                      aria-hidden="true"
                      className={`ml-1 text-[var(--secondary)] transition-transform ${
                        yearDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {yearDropdownOpen && (
                    <div
                      id="year-dropdown"
                      role="listbox"
                      aria-label="Years"
                      className="absolute left-0 right-0 z-30 mt-1 rounded-lg border border-zinc-200 bg-white p-1 shadow-lg"
                    >
                      <ul className="max-h-[150px] overflow-y-auto text-sm [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar]:w-1.5">
                        {Array.from({ length: 151 }, (_, i) => 1950 + i).map(
                          (y) => (
                            <li
                              key={y}
                              ref={y === yearVal ? selectedYearRef : null}
                              onClick={() => {
                                setYear(String(y));
                                value;
                                setViewDate(new Date(y, monthVal, 1));
                                setYearDropdownOpen(false);
                              }}
                              className={`cursor-pointer rounded-md border border-white px-2 py-1 last:mb-0 hover:border-[var(--secondary-trans)] hover:bg-[var(--secondary-trans-2)] ${
                                y === yearVal
                                  ? "bg-[var(--secondary-trans)] text-[var(--secondary)]"
                                  : ""
                              }`}
                            >
                              {y}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Month Dropdown */}
                <div className="relative" ref={monthDropdownRef}>
                  <button
                    type="button"
                    aria-label={`Select month, currently ${monthNames[monthVal]}`}
                    aria-expanded={monthDropdownOpen}
                    aria-controls="month-dropdown"
                    onClick={() => {
                      setMonthDropdownOpen((prev) => !prev);
                      setYearDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between rounded-md border border-zinc-200 bg-white px-2 py-1 pr-1 text-sm shadow-sm transition-all hover:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)] ${
                      monthDropdownOpen ? "ring-2 ring-[var(--secondary)]" : ""
                    }`}
                  >
                    <span>{monthNames[monthVal]}</span>
                    <IconChevronDown
                      size={15}
                      stroke={1.75}
                      aria-hidden="true"
                      className={`ml-1 text-[var(--secondary)] transition-transform ${
                        monthDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {monthDropdownOpen && (
                    <div
                      id="month-dropdown"
                      role="listbox"
                      aria-label="Months"
                      className="absolute left-0 right-0 z-30 mt-1 w-fit rounded-lg border border-zinc-200 bg-white p-1 shadow-lg"
                    >
                      <ul className="max-h-[150px] w-fit overflow-y-auto text-sm [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar]:w-1.5">
                        {monthNames.map((m, i) => (
                          <li
                            key={m}
                            ref={i === monthVal ? selectedMonthRef : null}
                            onClick={() => {
                              setMonth(String(i + 1).padStart(2, "0")); // Update the main month value
                              setViewDate(new Date(yearVal, i, 1));
                              setMonthDropdownOpen(false);
                            }}
                            className={`mb-1 cursor-pointer rounded-md border border-white px-2 py-1 last:mb-0 hover:border-[var(--secondary-trans)] hover:bg-[var(--secondary-trans-2)] ${
                              i === monthVal
                                ? "bg-[var(--secondary-trans)] text-[var(--secondary)] hover:bg-[var(--secondary-trans-2)]"
                                : ""
                            }`}
                          >
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Month */}
              <button
                type="button"
                aria-label="Next month"
                onClick={() => {
                  setViewDate(new Date(yearVal, monthVal + 1, 1));
                  setMonthDropdownOpen(false);
                  setYearDropdownOpen(false);
                }}
                className="rounded text-sm text-zinc-500 hover:text-[var(--secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
              >
                <IconChevronRight size={18} stroke={1.75} aria-hidden="true" />
              </button>
            </div>

            <div className="mb-1 grid grid-cols-7 gap-1 text-center text-xs text-zinc-500">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>

            <div
              role="grid"
              aria-label={`Calendar for ${monthNames[monthVal]} ${yearVal}`}
              className="grid grid-cols-7 gap-1 text-xs"
            >
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
                const formatted = `${yearVal}-${String(monthVal + 1).padStart(2, "0")}-${String(
                  d,
                ).padStart(2, "0")}`;
                const isSelected = formatted === `${year}-${month}-${day}`;
                const isToday = formatted === todayStr;
                return (
                  <button
                    key={d}
                    onClick={() => {
                      handleSelect(d);
                      setMonthDropdownOpen(false);
                      setYearDropdownOpen(false);
                    }}
                    type="button"
                    aria-label={`${monthNames[monthVal]} ${d}, ${yearVal}${isToday ? ", Today" : ""}${isSelected ? ", Selected" : ""}`}
                    className={`flex h-8 w-full items-center justify-center rounded-md text-center transition focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] ${
                      isSelected
                        ? "bg-[var(--secondary)] text-white"
                        : isToday
                          ? "border border-[var(--secondary)] font-semibold text-[var(--secondary)]"
                          : "hover:bg-[var(--secondary-trans-2)]"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <ValidationBox message={error ?? null} id={errorId} />
    </div>
  );
}
