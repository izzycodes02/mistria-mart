// components/ui/DataTable.tsx
'use client';

import {
  useState,
  useMemo,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
} from 'react';
// import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import clsx from 'clsx';

// ============================================================================
// TYPES
// ============================================================================

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  width?: number; // in pixels
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface StatBlock {
  title: string;
  value: string | number;
  color?: string;
}

export interface DataTableProps<T> {
  // Core data
  data: T[];
  columns: Column<T>[];

  // Layout
  className?: string;
  wFull?: boolean;

  // Features
  sortable?: boolean; // Global sortable default
  actions?: (row: T) => ReactNode; // Actions column content
  selectable?: boolean; // Enable row selection
  clickable?: {
    href: string | ((row: T) => string);
    target?: '_blank' | '_self';
  };

  // Stats
  stats?: StatBlock[];
  showStats?: boolean;

  // Pagination
  itemsPerPage?: number;
  itemsPerPageOptions?: number[];
  showPagination?: boolean;

  // Callbacks
  onRowSelect?: (selectedRows: T[]) => void;
  onRowClick?: (row: T) => void;
}

export interface DataTableRef<T> {
  getSelectedRows: () => T[];
  clearSelection: () => void;
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

const TableStats = ({ stats }: { stats: StatBlock[] }) => (
  <div className="flex gap-4 mb-4 flex-wrap">
    {stats.map((stat, index) => (
      <div
        key={index}
        className={clsx(
          'bg-white rounded-lg border border-zinc-200 px-4 py-3 shadow-sm',
          stat.color,
        )}
      >
        <p className="text-xs text-gray-500 uppercase tracking-wider">
          {stat.title}
        </p>
        <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
      </div>
    ))}
  </div>
);

const SortIcon = ({ direction }: { direction: 'asc' | 'desc' | null }) => {
  if (direction === 'asc') return <ChevronUp className="w-4 h-4" />;
  if (direction === 'desc') return <ChevronDown className="w-4 h-4" />;
  return <ChevronUp className="w-4 h-4 opacity-0 group-hover:opacity-30" />;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function DataTableInner<T extends Record<string, unknown>>(
  props: DataTableProps<T>,
  ref: React.ForwardedRef<DataTableRef<T>>,
) {
  const {
    data,
    columns,
    className = '',
    wFull = true,
    sortable: globalSortable = false,
    actions,
    selectable = false,
    clickable,
    stats = [],
    showStats = false,
    itemsPerPage: defaultItemsPerPage = 10,
    itemsPerPageOptions = [5, 10, 25, 50, 100],
    showPagination = true,
    onRowSelect,
    onRowClick,
  } = props;

  // ==========================================================================
  // STATE
  // ==========================================================================

  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc' | null;
  }>({ key: null, direction: null });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [selectedRows, setSelectedRows] = useState<Set<T>>(new Set());
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const selectAllRef = useRef<HTMLInputElement>(null);

  // ==========================================================================
  // SORTING LOGIC
  // ==========================================================================

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return data;

    return [...data].sort((a, b) => {
      const column = columns.find((col) => {
        // Fix: Compare accessor properly
        if (
          typeof col.accessor === 'function' ||
          typeof sortConfig.key !== 'string'
        ) {
          return false;
        }
        return col.accessor === sortConfig.key;
      });

      const accessor = column?.accessor;

      type SortableValue = string | number | boolean | null | undefined;
      let aValue: SortableValue;
      let bValue: SortableValue;

      if (typeof accessor === 'function') {
        // For function accessors, we need to render and compare strings
        // This is a simplified approach - you might want to implement custom sorting
        const aRendered = accessor(a);
        const bRendered = accessor(b);

        // Convert React nodes to strings for comparison
        aValue = aRendered?.toString() || '';
        bValue = bRendered?.toString() || '';
      } else if (accessor) {
        aValue = a[accessor as keyof T] as SortableValue;
        bValue = b[accessor as keyof T] as SortableValue;
      } else {
        return 0;
      }

      // Handle null/undefined values
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig, columns]);

  // ==========================================================================
  // PAGINATION
  // ==========================================================================
  // Reset page when data changes
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Ensure current page is valid (not out of bounds)
  const validCurrentPage = Math.min(currentPage, Math.max(1, totalPages));

  // Use validCurrentPage for pagination
  const paginatedData = useMemo(() => {
    const start = (validCurrentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, validCurrentPage, itemsPerPage]);

  // ==========================================================================
  // SELECTION HANDLERS
  // ==========================================================================

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
      onRowSelect?.([]);
    } else {
      const newSelected = new Set(selectedRows);
      paginatedData.forEach((row) => newSelected.add(row));
      setSelectedRows(newSelected);
      onRowSelect?.(Array.from(newSelected));
    }
  };

  const handleSelectRow = (row: T) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(row)) {
      newSelected.delete(row);
    } else {
      newSelected.add(row);
    }
    setSelectedRows(newSelected);
    onRowSelect?.(Array.from(newSelected));
  };

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedRows.has(row));

  const isIndeterminate =
    selectedRows.size > 0 && selectedRows.size < paginatedData.length;

  // Set indeterminate state on select all checkbox
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  // ==========================================================================
  // EXPOSE METHODS VIA REF
  // ==========================================================================

  useImperativeHandle(ref, () => ({
    getSelectedRows: () => Array.from(selectedRows) as T[],
    clearSelection: () => setSelectedRows(new Set()),
  }));

  // ==========================================================================
  // SORT HANDLER
  // ==========================================================================

  const handleSort = (column: Column<T>) => {
    if (!column.sortable && !globalSortable) return;

    const key = column.accessor;
    if (typeof key === 'function') return; // Can't sort by function accessor

    setSortConfig((prev) => ({
      key: key as keyof T,
      direction:
        prev.key === key && prev.direction === 'asc'
          ? 'desc'
          : prev.key === key && prev.direction === 'desc'
            ? null
            : 'asc',
    }));
  };

  // ==========================================================================
  // GET CELL VALUE
  // ==========================================================================

  const getCellValue = (row: T, column: Column<T>): ReactNode => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor] as ReactNode;
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className={clsx('flex flex-col', className)}>
      {/* Stats Section */}
      {showStats && stats.length > 0 && <TableStats stats={stats} />}

      {/* Table Container with Horizontal Scroll */}
      <div
        ref={tableContainerRef}
        className="overflow-x-auto border border-zinc-200 rounded-lg shadow-sm bg-white"
      >
        <table className={clsx('divide-y divide-zinc-200', wFull && 'w-full')}>
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              {/* Select All Column */}
              {selectable && (
                <th className="px-3 py-3 w-10 sticky left-0 bg-gray-50 z-10">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}

              {/* Data Columns */}
              {columns.map((column, index) => {
                const isSorted = sortConfig.key === column.accessor;
                const sortDirection = isSorted ? sortConfig.direction : null;

                return (
                  <th
                    key={index}
                    onClick={() => handleSort(column)}
                    style={{
                      width: column.width ? `${column.width}px` : 'auto',
                      minWidth: column.width ? `${column.width}px` : 'auto',
                    }}
                    className={clsx(
                      'px-3 py-2 text-sm text-gray-500 font-bold',
                      (column.sortable || globalSortable) &&
                        'cursor-pointer hover:bg-gray-100 group',
                      column.align === 'left' && 'text-left',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      !column.align && 'text-left',
                    )}
                  >
                    <div className="flex items-center gap-1">
                      <span>{column.header}</span>
                      {(column.sortable || globalSortable) && (
                        <SortIcon direction={sortDirection} />
                      )}
                    </div>
                  </th>
                );
              })}

              {/* Actions Column */}
              {actions && (
                <th className="px-3 py-3 w-20 sticky right-0 bg-gray-50 z-10">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-zinc-200">
            {paginatedData.map((row, rowIndex) => {
              const isSelected = selectedRows.has(row);
              //   const isHovered = hoveredRow === rowIndex;

              // Determine if row is clickable
              const rowIsClickable = Boolean(clickable || onRowClick);
              //   const rowHref = clickable
              //     ? typeof clickable.href === 'function'
              //       ? clickable.href(row)
              //       : clickable.href
              //     : undefined;

              // Row click handler
              const handleRowClick = (e: React.MouseEvent) => {
                // Don't trigger if clicking on interactive elements
                if ((e.target as HTMLElement).closest('button, a, input')) {
                  return;
                }
                onRowClick?.(row);
              };

              return (
                <tr
                  key={rowIndex}
                  onMouseEnter={() => setHoveredRow(rowIndex)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={handleRowClick}
                  className={clsx(
                    'transition-colors duration-150',
                    isSelected && 'bg-blue-50',
                    rowIsClickable && 'cursor-pointer hover:bg-gray-50',
                  )}
                >
                  {/* Select Row Checkbox */}
                  {selectable && (
                    <td className="px-3 py-3 sticky left-0 bg-inherit z-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(row)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}

                  {/* Data Cells */}
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={clsx(
                        'px-3 py-3 text-sm text-gray-900',
                        column.align === 'left' && 'text-left',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right',
                        !column.align && 'text-left',
                      )}
                    >
                      {getCellValue(row, column)}
                    </td>
                  ))}

                  {/* Actions Cell */}
                  {actions && (
                    <td className="px-3 py-3 sticky right-0 bg-inherit z-10">
                      <div onClick={(e) => e.stopPropagation()}>
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}

            {/* Empty State */}
            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={
                    columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)
                  }
                  className="px-3 py-8 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && sortedData.length > 0 && (
        <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span>entries</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              {sortedData.length > 0 ? (
                <>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, sortedData.length)} of{' '}
                  {sortedData.length} entries
                </>
              ) : (
                'Showing 0 entries'
              )}
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={clsx(
                  'p-1 rounded border border-gray-300',
                  currentPage === 1
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-50',
                )}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 text-sm bg-blue-50 rounded">
                {currentPage} / {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={clsx(
                  'p-1 rounded border border-gray-300',
                  currentPage === totalPages
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-50',
                )}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Forward ref to make the component accept refs
export const DataTable = forwardRef(DataTableInner) as <T>(
  props: DataTableProps<T> & { ref?: React.ForwardedRef<DataTableRef<T>> },
) => ReturnType<typeof DataTableInner>;
