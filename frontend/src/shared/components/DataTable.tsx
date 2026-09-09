import { cn } from '../utils/format';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({ columns, rows, rowKey, emptyMessage = 'No records found', onRowClick }: DataTableProps<T>) {
  if (rows.length === 0) {
    return <p className="rounded-lg border border-dashed border-ink/15 bg-white px-4 py-10 text-center text-sm text-muted">{emptyMessage}</p>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-ink/10 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-ink/10 bg-surface">
            {columns.map((c) => (
              <th key={c.key} scope="col" className={cn('px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted', c.className)}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn('border-b border-ink/5 last:border-0', onRowClick && 'cursor-pointer hover:bg-primary/5')}
            >
              {columns.map((c) => (
                <td key={c.key} className={cn('px-3 py-2.5 align-middle text-ink', c.className)}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (page: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="mt-4 flex items-center justify-between" aria-label="Pagination">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="h-9 rounded-lg border border-ink/15 px-3 text-sm font-medium disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-sm text-muted">
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="h-9 rounded-lg border border-ink/15 px-3 text-sm font-medium disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}
