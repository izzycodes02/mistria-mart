'use client';

import { useState, useMemo } from 'react';

type Column<T> = {
  header: string;
  accessor: keyof T;
  width?: number;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
};

type StatBlock = {
  title: string;
  value: string | number;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];

  stats?: StatBlock[];

  actionsColumn?: {
    width?: number;
    render: (row: T) => React.ReactNode;
  };

  selectableRows?: boolean;
  rowClickable?: (row: T) => void;

  pageSize?: number;
};

export default function Table<T extends { id: string | number }>({
  columns,
  data,
  stats,
  actionsColumn,
  selectableRows = false,
  rowClickable,
  pageSize = 10,
}: TableProps<T>) {
  const [page, setPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set(),
  );

  const totalPages = Math.ceil(data.length / pageSize);

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === bValue) return 0;

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      }

      return aValue < bValue ? 1 : -1;
    });
  }, [data, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const toggleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    const accessor = column.accessor;

    if (sortColumn === accessor) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(accessor);
      setSortDirection('asc');
    }
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
      return;
    }

    const newSet = new Set<string | number>();
    paginatedData.forEach((row) => newSet.add(row.id));
    setSelectedRows(newSet);
  };

  const toggleRow = (id: string | number) => {
    const newSet = new Set(selectedRows);

    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);

    setSelectedRows(newSet);
  };

  return (
    <div className="w-full">
      {/* Stats */}
      {stats && stats.length > 0 && (
        <div className="flex gap-4 mb-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="px-4 py-2 rounded-lg border bg-white shadow-sm"
            >
              <div className="text-xs text-gray-500">{stat.title}</div>
              <div className="text-lg font-semibold">{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Scroll container */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full min-w-max">
          {/* Header */}
          <thead className="bg-gray-50">
            <tr>
              {selectableRows && (
                <th className="w-10 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={toggleSelectAll}
                    checked={
                      paginatedData.length > 0 &&
                      selectedRows.size === paginatedData.length
                    }
                  />
                </th>
              )}

              {columns.map((col) => (
                <th
                  key={String(col.accessor)}
                  style={{ width: col.width }}
                  onClick={() => toggleSort(col)}
                  className={`px-4 py-3 text-left text-sm font-medium whitespace-nowrap
                    ${col.sortable ? 'cursor-pointer select-none' : ''}
                  `}
                >
                  <div className="flex items-center gap-2">
                    {col.header}

                    {sortColumn === col.accessor && (
                      <span className="text-xs">
                        {sortDirection === 'asc' ? '▲' : '▼'}
                      </span>
                    )}
                  </div>
                </th>
              ))}

              {actionsColumn && (
                <th
                  style={{ width: actionsColumn.width || 80 }}
                  className="sticky right-0 bg-gray-50 px-4"
                />
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {paginatedData.map((row) => (
              <tr
                key={row.id}
                onClick={() => rowClickable?.(row)}
                className={`
                  border-t
                  ${rowClickable ? 'cursor-pointer hover:bg-gray-50 group' : ''}
                `}
              >
                {selectableRows && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.id)}
                      onChange={() => toggleRow(row.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}

                {columns.map((col) => (
                  <td
                    key={String(col.accessor)}
                    style={{ width: col.width }}
                    className={`px-4 py-3 whitespace-nowrap
                      ${rowClickable ? 'group-hover:underline' : ''}
                    `}
                  >
                    {col.render ? col.render(row) : String(row[col.accessor])}
                  </td>
                ))}

                {actionsColumn && (
                  <td className="sticky right-0 bg-white px-4 py-3">
                    {actionsColumn.render(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="text-gray-500">
          Showing {(page - 1) * pageSize + 1}-
          {Math.min(page * pageSize, data.length)} of {data.length}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          <span className="px-2">
            {page} / {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
