"use client";

import * as TablerIcons from "@tabler/icons-react";
import { useEffect, useRef } from "react";

type Props = {
  label: string;
  icon?: keyof typeof TablerIcons;
  required?: boolean;
  placeholder: string;
  value?: string;
  variant: "row" | "col";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
  maxLength?: number;
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
      className="validationBox normal modal mt-1 text-sm text-red-600"
    >
       <p className="flex items-center gap-1">
        <span aria-hidden="true">
          <TablerIcons.IconExclamationCircle size={18} stroke={1.75} />
        </span>
        <span className="mt-[2px]">{message}</span>
      </p>
    </section>
  );
}

export default function TextInput({
  label,
  icon,
  required,
  variant,
  placeholder,
  onChange,
  value,
  error,
  maxLength,
}: Props) {
  const IconComponent = icon
    ? (TablerIcons[icon] as React.FC<{ size?: number; stroke?: number }>)
    : null;

  const errorId = `${label.replace(/\s+/g, "-").toLowerCase()}-error`;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (error && inputRef.current) {
      inputRef.current.focus();
    }
  }, [error]);

  return (
    <div
      className={`flex ${variant === "row" ? "flex-row" : "w-full flex-col"}`}
      role={error ? "alert" : undefined}
    >
      <label
        htmlFor={`textinput-${label.replace(/\s+/g, "-").toLowerCase()}`}
        className="text-sm font-semibold"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative w-full">
        {IconComponent && (
          <span
            className="absolute left-2 top-1/2 -translate-y-1/2 text-[var(--secondary)]"
            aria-hidden="true"
          >
            <IconComponent size={18} stroke={1.75} />
          </span>
        )}

        <input
          ref={inputRef}
          type="text"
          id={`textinput-${label.replace(/\s+/g, "-").toLowerCase()}`}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          aria-required={required}
          aria-invalid={!!error}
          maxLength={maxLength}
          aria-describedby={error ? errorId : undefined}
          className={`placeholder:italics peer w-full rounded-lg border border-zinc-200 px-2.5 py-1.5 text-sm shadow-sm outline-none transition-all placeholder:text-zinc-400 focus-within:border-[var(--secondary)] hover:border-[var(--secondary)] focus:ring-2 focus:ring-[var(--secondary)] ${icon && "pl-8"} ${error && "inputError border-red-300 focus-within:border-red-300 hover:border-red-300 focus:ring-red-300"} `}
        />

        <ValidationBox message={error ?? null} id={errorId} />
      </div>
    </div>
  );
}
