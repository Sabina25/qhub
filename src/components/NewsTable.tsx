import React from 'react';
import { formatLocaleDate, Lang } from '../utils/dates';
import { Row } from '../hooks/useNews';

function pickL10n(val: any, lang: Lang): string {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') return val[lang] ?? val.ua ?? val.en ?? '';
  return '';
}

export const NewsTable: React.FC<{
  rows: Row[];
  lang: Lang;
  loading: boolean;
  onEdit: (row: Row) => void;
  onDelete: (id: string) => void;
}> = ({ rows, lang, loading, onEdit, onDelete }) => {
  // mobile
  const MobileList = (
    <div className="md:hidden space-y-3">
      {loading ? (
        <div className="p-4 rounded-xl border bg-gray-50 text-gray-600">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="p-4 rounded-xl border bg-gray-50 text-gray-600">No news yet</div>
      ) : (
        rows.map((r) => (
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

  // deck
  const DesktopTable = (
    <div className="hidden md:block border rounded-xl overflow-hidden">
      <div className="overflow-x-auto"> 
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Date</th>
              <th className="p-3">Featured</th>
              <th className="p-3 w-40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={4}>Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="p-3" colSpan={4}>No news yet</td></tr>
            ) : (
              rows.map(r => (
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

  return (
    <>
      {MobileList}
      {DesktopTable}
    </>
  );
};
