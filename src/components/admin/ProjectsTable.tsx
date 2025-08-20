import React, { useMemo, useState } from 'react';
import { ProjectDoc } from '../data/projects';
import { Lang, pickL10n } from '../types/l10n';

function formatYMDLocal(ymd?: string): string {
  if (!ymd) return '—';
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) return '—';
  return new Date(y, m - 1, d).toLocaleDateString('uk-UA');
}

export type ProjectsTableProps = {
  rows: ProjectDoc[];
  loading: boolean;
  onEdit: (row: ProjectDoc) => void;
  onDelete: (id: string) => void;
};

export const ProjectsTable: React.FC<ProjectsTableProps> = ({ rows, loading, onEdit, onDelete }) => {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((r: any) => {
      const ua = pickL10n(r.title, 'ua').toLowerCase();
      const en = pickL10n(r.title, 'en').toLowerCase();
      return ua.includes(query) || en.includes(query);
    });
  }, [rows, q]);

  // mobile
  const Mobile = (
    <div className="md:hidden space-y-3">
      {loading ? (
        <div className="p-4 rounded-xl border bg-gray-50 text-gray-600">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="p-4 rounded-xl border bg-gray-50 text-gray-600">No projects found</div>
      ) : (
        filtered.map((r: any) => (
          <div key={r.id} className="border rounded-xl p-4 bg-white shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-medium text-base leading-snug line-clamp-2">
                {pickL10n(r.title, 'ua') || pickL10n(r.title, 'en') || '—'}
              </h3>
              {r.featured && (
                <span className="shrink-0 rounded-full bg-green-100 text-green-700 text-[10px] px-2 py-0.5">
                  Featured
                </span>
              )}
            </div>
            <div className="mt-2 text-xs text-gray-500">{formatYMDLocal(r.dateYMD)}</div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => onEdit(r)} className="flex-1 px-3 py-2 rounded-lg border hover:bg-gray-50 text-sm">Edit</button>
              <button onClick={() => onDelete(r.id)} className="flex-1 px-3 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-sm">Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );

  // desktop
  const Desktop = (
    <div className="hidden md:block border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 w-[50%]">Title</th>
              <th className="p-3 w-[20%]">Date</th>
              <th className="p-3 w-[10%]">Featured</th>
              <th className="p-3 w-[20%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-3" colSpan={4}>Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td className="p-3" colSpan={4}>No projects found</td></tr>
            ) : (
              filtered.map((r: any) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">
                    <div className="font-medium line-clamp-2">
                      {pickL10n(r.title, 'ua') || pickL10n(r.title, 'en') || '—'}
                    </div>
                  </td>
                  <td className="p-3 whitespace-nowrap">{formatYMDLocal(r.dateYMD)}</td>
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
    </div>
  );

  return (
    <section className="mt-10">
      <h3 className="text-2xl font-semibold mb-4">Projects</h3>
      <div className="mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Поиск по названию (ua/en)…"
          className="w-full md:w-1/2 border rounded-lg px-3 py-2"
        />
      </div>
      {Mobile}
      {Desktop}
    </section>
  );
};
