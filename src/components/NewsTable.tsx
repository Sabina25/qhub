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
}> = ({ rows, lang, loading, onEdit, onDelete }) => (
  <div className="border rounded-xl overflow-hidden">
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
                <div className="font-medium">{pickL10n(r.title, lang) || '—'}</div>
              </td>
              <td className="p-3">{formatLocaleDate(r.dateYMD, lang)}</td>
              <td className="p-3">{r.featured ? 'Yes' : 'No'}</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(r)} className="px-3 py-1 rounded border hover:bg-gray-50">Edit</button>
                  <button onClick={() => onDelete(r.id)} className="px-3 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50">Delete</button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);