import React, { useEffect, useMemo, useState } from 'react';
import { formatLocaleDate, Lang } from '../../utils/dates';
import { Row } from '../../hooks/useNews';

function pickL10n(val: any, lang: Lang): string {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') return val[lang] ?? val.ua ?? val.en ?? '';
  return '';
}

const PER_PAGE = 20;

export const NewsTable: React.FC<{
  rows: Row[];
  lang: Lang;
  loading: boolean;
  onEdit: (row: Row) => void;
  onDelete: (id: string) => void;
}> = ({ rows, lang, loading, onEdit, onDelete }) => {
  // ---- filters
  const [q, setQ] = useState('');
  const [fromYmd, setFromYmd] = useState('');
  const [toYmd, setToYmd] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [q, fromYmd, toYmd]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter((r) => {
      const title = pickL10n(r.title, lang).toLowerCase();
      const byTitle = !query || title.includes(query);
      const date = r.dateYMD || '';
      const byFrom = !fromYmd || (date && date >= fromYmd);
      const byTo = !toYmd || (date && date <= toYmd);
      return byTitle && byFrom && byTo;
    });
  }, [rows, lang, q, fromYmd, toYmd]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  const paged = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, currentPage]);

  function pageNumbers(totalPages: number, current: number) {
    const nums: (number | '…')[] = [];
    const add = (n: number | '…') => nums.push(n);
    const windowSize = 2;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) add(i);
      return nums;
    }

    add(1);
    if (current > 1 + windowSize + 1) add('…');

    const start = Math.max(2, current - windowSize);
    const end = Math.min(totalPages - 1, current + windowSize);
    for (let i = start; i <= end; i++) add(i);

    if (current < totalPages - windowSize - 1) add('…');
    add(totalPages);
    return nums;
  }

  const numbers = pageNumbers(totalPages, currentPage);

  const Filters = (
    <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Search by title</label>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Type to search…"
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Date from</label>
        <input
          type="date"
          value={fromYmd}
          onChange={(e) => setFromYmd(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Date to</label>
        <input
          type="date"
          value={toYmd}
          onChange={(e) => setToYmd(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>
      <div className="flex items-end gap-2">
        <button
          type="button"
          onClick={() => {
            setQ('');
            setFromYmd('');
            setToYmd('');
          }}
          className="w-full border rounded-lg px-3 py-2 hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </div>
  );

  // ---- Мобильная вёрстка
  const MobileList = (
    <div className="md:hidden space-y-3">
      {loading ? (
        <div className="p-4 rounded-xl border bg-gray-50 text-gray-600">Loading…</div>
      ) : paged.length === 0 ? (
        <div className="p-4 rounded-xl border bg-gray-50 text-gray-600">No news found</div>
      ) : (
        paged.map((r) => (
          <div key={r.id} className="border rounded-xl p-4 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-medium text-base leading-snug line-clamp-2">
                {pickL10n(r.title, lang) || '—'}
              </h3>
              {r.featured && (
                <span className="shrink-0 rounded-full bg-green-100 text-green-700 text-[10px] px-2 py-0.5">
                  Featured
                </span>
              )}
            </div>

            <div className="mt-2 text-xs text-gray-500">
              {formatLocaleDate(r.dateYMD, lang)}
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => onEdit(r)}
                className="flex-1 px-3 py-2 rounded-lg border hover:bg-gray-50 active:bg-gray-100 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(r.id)}
                className="flex-1 px-3 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 active:bg-red-100 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  // ---- Десктопная вёрстка
  const DesktopTable = (
    <div className="hidden md:block border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 w-[55%]">Title</th>
              <th className="p-3 w-[15%]">Date</th>
              <th className="p-3 w-[10%]">Featured</th>
              <th className="p-3 w-[20%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={4}>Loading…</td></tr>
            ) : paged.length === 0 ? (
              <tr><td className="p-3" colSpan={4}>No news found</td></tr>
            ) : (
              paged.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">
                    <div className="font-medium line-clamp-2">{pickL10n(r.title, lang) || '—'}</div>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {formatLocaleDate(r.dateYMD, lang)}
                  </td>
                  <td className="p-3">{r.featured ? 'Yes' : 'No'}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(r)}
                        className="px-3 py-1 rounded border hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(r.id)}
                        className="px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ---- Пагинация
  const Pagination = (
    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="text-sm text-gray-600">
        {total > 0
          ? `Showing ${(currentPage - 1) * PER_PAGE + 1}–${Math.min(currentPage * PER_PAGE, total)} of ${total}`
          : 'No results'}
      </div>

      <div className="flex items-center gap-1">
        <button
          className="px-3 py-1.5 border rounded hover:bg-gray-50 disabled:opacity-50"
          disabled={currentPage <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </button>

        {numbers.map((n, idx) =>
          n === '…' ? (
            <span key={`e-${idx}`} className="px-2 text-gray-500 select-none">…</span>
          ) : (
            <button
              key={n}
              onClick={() => setPage(n as number)}
              className={`px-3 py-1.5 border rounded ${n === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50'}`}
            >
              {n}
            </button>
          )
        )}

        <button
          className="px-3 py-1.5 border rounded hover:bg-gray-50 disabled:opacity-50"
          disabled={currentPage >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {Filters}
      {MobileList}
      {DesktopTable}
      {(!loading && totalPages > 1) && Pagination}
    </div>
  );
};
