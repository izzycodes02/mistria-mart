'use client';

import { useState, useRef, useEffect } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import clsx from 'clsx';

export type SelectOption = {
  label: string;
  value: string;
};

interface SelectInputProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export default function SelectInput({
  options,
  value,
  placeholder = 'Select...',
  onChange,
  className,
}: SelectInputProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: SelectOption) => {
    onChange?.(option.value);
    setOpen(false);
  };

  return (
    <div ref={ref} className={clsx('relative w-full')}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={clsx(
          'authInput w-full flex items-center justify-between px-3',
          className,
        )}
      >
        <span className={selected ? 'text-gray-900' : 'text-gray-400'}>
          {selected?.label || placeholder}
        </span>

        <IconChevronDown
          size={16}
          className={clsx(
            'transition-transform text-gray-400',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-neutral-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className={clsx(
                'px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm',
                value === option.value && 'font-semibold',
              )}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
