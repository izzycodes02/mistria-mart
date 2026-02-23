'use client';

import React, { useState, useMemo } from 'react';

// --- Types ---
export type ColumnDef<T> = {
  header: string;
  // Accessor can be a key of your data (like 'name') or a function to render custom UI
  accessor: keyof T | ((row: T) => React.ReactNode);
  width?: number; // in px
  sortable?: boolean;
};

export type StatBlock = {
  title: string;
  value: string | number;
};

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  stats?: StatBlock[];

  // Selection
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;

  // Actions Column (Sticky Right)
  renderActions?: (row: T) => React.ReactNode;

  // Clickable Rows
  onRowClick?: (row: T) => void;

  // Pagination
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export default function Table<T extends { id: string | number }>({
  data,
  columns,
  stats,
  selectable = false,
  onSelectionChange,
  renderActions,
  onRowClick,
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
}: TableProps<T>) {
  // --- Sorting State ---
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null);

  // --- Selection State ---
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(
    new Set(),
  );

  // --- Handlers ---
  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = new Set(data.map((row) => row.id));
      setSelectedIds(allIds);
      onSelectionChange?.(data);
    } else {
      setSelectedIds(new Set());
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (row: T, isChecked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (isChecked) {
      newSelected.add(row.id);
    } else {
      newSelected.delete(row.id);
    }
    setSelectedIds(newSelected);
    onSelectionChange?.(data.filter((r) => newSelected.has(r.id)));
  };

  // --- Derived Data ---
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="w-full font-sans text-sm text-gray-800">
      {/* Mini Stats Block */}
      {stats && stats.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm min-w-[150px]"
            >
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                {stat.title}
              </div>
              <div className="text-2xl font-semibold mt-1">{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Table Container with Horizontal Scroll */}
      <div className="w-full overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          {/* Header */}
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
            <tr>
              {selectable && (
                <th className="px-4 py-3 w-12 text-center">
                  <input
                    type="checkbox"
                    className="cursor-pointer rounded border-gray-300"
                    checked={
                      data.length > 0 && selectedIds.size === data.length
                    }
                    onChange={handleSelectAll}
                  />
                </th>
              )}

              {columns.map((col, idx) => (
                <th
                  key={idx}
                  style={{ width: col.width ? `${col.width}px` : 'auto' }}
                  className={`px-4 py-3 ${col.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''}`}
                  onClick={() =>
                    col.sortable &&
                    typeof col.accessor === 'string' &&
                    handleSort(col.accessor as keyof T)
                  }
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {/* Simple sort indicator */}
                    {sortConfig?.key === col.accessor && (
                      <span className="text-xs">
                        {sortConfig.direction === 'asc' ? ' ▲' : ' ▼'}
                      </span>
                    )}
                  </div>
                </th>
              ))}

              {renderActions && (
                <th className="px-4 py-3 sticky right-0 bg-gray-50 z-10 shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.1)]">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {sortedData.length > 0 ? (
              sortedData.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-gray-100 group transition-colors ${
                    onRowClick
                      ? 'cursor-pointer hover:bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Select Checkbox */}
                  {selectable && (
                    <td
                      className="px-4 py-3 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="cursor-pointer rounded border-gray-300"
                        checked={selectedIds.has(row.id)}
                        onChange={(e) => handleSelectRow(row, e.target.checked)}
                      />
                    </td>
                  )}

                  {/* Data Cells */}
                  {columns.map((col, idx) => (
                    <td key={idx} className="px-4 py-3">
                      <span
                        className={onRowClick ? 'group-hover:underline' : ''}
                      >
                        {typeof col.accessor === 'function'
                          ? col.accessor(row)
                          : (row[col.accessor] as React.ReactNode)}
                      </span>
                    </td>
                  ))}

                  {/* Actions Column (Sticky) */}
                  {renderActions && (
                    <td
                      className={`px-4 py-3 sticky right-0 z-10 text-right shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.1)] transition-colors ${
                        onRowClick
                          ? 'bg-white group-hover:bg-blue-50'
                          : 'bg-white group-hover:bg-gray-50'
                      }`}
                      onClick={(e) => e.stopPropagation()} // Prevent row click when clicking actions
                    >
                      {renderActions(row)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (selectable ? 1 : 0) +
                    (renderActions ? 1 : 0)
                  }
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: Pagination & Info */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4 text-gray-600">
        <div>
          {totalItems > 0 && (
            <span>
              Showing <span className="font-medium">{startIndex}</span> to{' '}
              <span className="font-medium">{endIndex}</span> of{' '}
              <span className="font-medium">{totalItems}</span> results
            </span>
          )}
        </div>

        {totalItems > itemsPerPage && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            <span className="px-2">Page {currentPage}</span>
            <button
              onClick={() => onPageChange?.(currentPage + 1)}
              disabled={endIndex >= totalItems}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
