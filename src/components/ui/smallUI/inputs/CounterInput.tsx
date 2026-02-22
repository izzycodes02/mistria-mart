"use client";

import { useState } from "react";
import { IconMinus, IconPlus } from "@tabler/icons-react";

type Props = {
  label: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  variant?: "row" | "col";
  title?: string;
  onChange?: (value: number) => void;
};

export default function CounterInput({
  label,
  value = 0,
  min = 0,
  max = Infinity,
  step = 1,
  variant = "row",
  title,
  onChange,
}: Props) {
  const [count, setCount] = useState(value);
  const [inputValue, setInputValue] = useState(String(value));

  const updateValue = (newValue: number) => {
    const validValue = Math.min(Math.max(newValue, min), max);
    setCount(validValue);
    setInputValue(String(validValue));
    onChange?.(validValue);
  };

  const increment = () => updateValue(count + step);
  const decrement = () => updateValue(count - step);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // allow empty temporarily for editing
    if (val === "") {
      setInputValue("");
      return;
    }

    // allow only digits
    if (/^\d+$/.test(val)) {
      const num = parseInt(val, 10);
      setInputValue(val);
      updateValue(num);
    }
  };

  const handleBlur = () => {
    // restore valid number on blur if empty or invalid
    if (inputValue === "" || isNaN(Number(inputValue))) {
      setInputValue(String(count));
    } else {
      updateValue(Number(inputValue));
    }
  };

  return (
    <div
    title={title}
      className={`flex ${
        variant === "row"
          ? "w-full flex-row items-center justify-between gap-3"
          : "flex-col gap-1"
      }`}
    >
      <label htmlFor="counter-value" className="text-sm font-semibold">
        {label}
      </label>

      <div
        role="group"
        aria-label={`${label} counter`}
        className="flex items-center rounded-lg border border-zinc-200 bg-white px-1 py-1 shadow-sm focus-within:border-[var(--secondary)] focus-within:ring-2 focus-within:ring-[var(--secondary)] hover:border-[var(--secondary)]"
      >
        <button
          type="button"
          onClick={decrement}
          disabled={count <= min}
          aria-label={`Decrease ${label} by ${step}`}
          aria-controls="counter-value"
          className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--secondary)] text-white transition hover:bg-[var(--secondary-darker)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[var(--secondary)]"
        >
          <IconMinus
            size={14}
            stroke={2}
            className="icon-shadow"
            aria-hidden="true"
          />
        </button>

        <input
          type="text"
          id="counter-value"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          inputMode="numeric"
          aria-label={`Current ${label} value`}
          aria-live="polite"
          aria-atomic="true"
          className="mx-2 w-10 bg-transparent text-center text-sm font-medium outline-none"
        />

        <button
          type="button"
          onClick={increment}
          disabled={count >= max}
          aria-label={`Increase ${label} by ${step}`}
          aria-controls="counter-value"
          className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--secondary)] text-white transition hover:bg-[var(--secondary-darker)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[var(--secondary)]"
        >
          <IconPlus
            size={14}
            stroke={2}
            className="icon-shadow"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
