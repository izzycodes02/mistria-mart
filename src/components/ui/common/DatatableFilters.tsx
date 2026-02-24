'use client';

import { ReactNode } from 'react';
import { IconSearch } from '@tabler/icons-react';
import clsx from 'clsx';
import SelectInput from '../smallUI/inputs/SelectInput';

export type FilterType = 'text' | 'dropdown' | 'date' | 'range';

export interface FilterConfig {
  id: string;
  label: string;
  type: FilterType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  value?: string | number | { min?: number; max?: number };
  onChange: (value?: string | number | { min?: number; max?: number }) => void;
  className?: string;
  icon?: ReactNode;
}

interface DataTableFiltersProps {
  filters: FilterConfig[];
  className?: string;
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
}

const gridColsMap = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
};

export function DataTableFilters({
  filters,
  className = '',
  columns = 4,
}: DataTableFiltersProps) {
  const     renderFilterInput = (filter: FilterConfig) => {
    switch (filter.type) {
      case 'text':
        return (
          <div className="relative">
            <input
              id={filter.id}
              type="text"
              placeholder={
                filter.placeholder || `Search by ${filter.label.toLowerCase()}`
              }
              autoComplete="off"
              value={(filter.value as string) || ''}
              onChange={(e) => filter.onChange(e.target.value)}
              className={clsx('authInput peer w-full pl-8', filter.className)}
              onFocus={(e) =>
                e.currentTarget.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                })
              }
            />

            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
              {filter.icon || <IconSearch size={16} />}
            </span>
          </div>
        );

      case 'dropdown':
        return (
          <SelectInput
            options={filter.options || []}
            value={filter.value as string}
            placeholder={filter.placeholder || 'Select option'}
            onChange={(value) => filter.onChange(value)}
            className={filter.className}
          />
        );

      case 'date':
        return (
          <input
            id={filter.id}
            type="date"
            value={(filter.value as string) || ''}
            onChange={(e) => filter.onChange(e.target.value)}
            className={clsx('authInput w-full', filter.className)}
          />
        );

      case 'range': {
        const value =
          typeof filter.value === 'object' && filter.value !== null
            ? filter.value
            : {};

        return (
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={value.min ?? ''}
              onChange={(e) =>
                filter.onChange({
                  ...value,
                  min: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className={clsx('authInput w-full', filter.className)}
            />

            <input
              type="number"
              placeholder="Max"
              value={value.max ?? ''}
              onChange={(e) =>
                filter.onChange({
                  ...value,
                  max: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className={clsx('authInput w-full', filter.className)}
            />
          </div>
        );
      }

      default:
        return null;
    }
  };

  if (filters.length === 0) return null;

  return (
    <div
      className={clsx(
        'mb-4 w-full grid grid-cols-1 gap-4 border rounded-2xl p-4 border-neutral-200',
        gridColsMap[columns],
        className,
      )}
    >
      {filters.map((filter) => (
        <section key={filter.id} className="flex flex-col gap-1">
          <label
            htmlFor={filter.id}
            className="font-semibold text-gray-500 text-sm"
          >
            {filter.label}
          </label>

          {renderFilterInput(filter)}
        </section>
      ))}
    </div>
  );
}
