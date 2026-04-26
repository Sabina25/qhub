import React, { useEffect, useMemo, useRef, useState } from 'react';
import { formatLocaleDate, Lang } from '../../utils/dates';
import { Row } from '../../hooks/useNews';

function pickL10n(val: any, lang: Lang): string {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') return val[lang] ?? val.ua ?? val.en ?? '';
  return '';
}

const PER_PAGE = 25;

export const NewsTable: React.FC<{
  rows: Row[];
  lang: Lang;
  loading: boolean;
  onEdit: (row: Row) => void;
  onDelete: (id: string) => void;
}> = ({ rows, lang, loading, onEdit, onDelete }) => {
  const [q, setQ]             = useState('');
  const [fromYmd, setFromYmd] = useState('');
  const [toYmd, setToYmd]     = useState('');
  const [page, setPage]       = useState(1);
  const topRef                = useRef<HTMLDivElement>(null);

  useEffect(() => { setPage(1); }, [q, fromYmd, toYmd]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return rows.filter((r) => {
      const title = pickL10n(r.title, lang).toLowerCase();
      const date  = r.dateYMD || '';
      return (!query || title.includes(query))
          && (!fromYmd || date >= fromYmd)
          && (!toYmd   || date <= toYmd);
    });
  }, [rows, lang, q, fromYmd, toYmd]);

  const total       = filtered.length;
  const totalPages  = Math.max(1, Math.ceil(total / PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  const paged = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
  }, [filtered, currentPage]);

  const goToPage = (n: number) => {
    setPage(n);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  function pageNumbers(total: number, cur: number) {
    const nums: (number | '…')[] = [];
    if (total <= 7) { for (let i = 1; i <= total; i++) nums.push(i); return nums; }
    nums.push(1);
    if (cur > 4) nums.push('…');
    for (let i = Math.max(2, cur - 2); i <= Math.min(total - 1, cur + 2); i++) nums.push(i);
    if (cur < total - 3) nums.push('…');
    nums.push(total);
    return nums;
  }

  const btnBase: React.CSSProperties = { padding: '5px 14px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 13, cursor: 'pointer', background: '#fff', transition: 'background 0.15s', color: '#111827' };
  const btnDanger: React.CSSProperties = { ...btnBase, border: '1px solid #fca5a5', color: '#dc2626' };

  return (
    <div ref={topRef}>
      <style>{`
        .nt-mobile  { display: flex; flex-direction: column; gap: 10px; }
        .nt-desktop { display: none; }
        @media (min-width: 768px) {
          .nt-mobile  { display: none !important; }
          .nt-desktop { display: block !important; }
        }
      `}</style>

      {/* ── Filters ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Search by title</label>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Type to search…"
            style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '7px 12px', fontSize: 13, color: '#111827' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Date from</label>
          <input type="date" value={fromYmd} onChange={e => setFromYmd(e.target.value)}
            style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '7px 12px', fontSize: 13, color: '#111827' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Date to</label>
          <input type="date" value={toYmd} onChange={e => setToYmd(e.target.value)}
            style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '7px 12px', fontSize: 13, color: '#111827' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button type="button" onClick={() => { setQ(''); setFromYmd(''); setToYmd(''); }}
            style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: 8, padding: '7px 12px', fontSize: 13, cursor: 'pointer', background: '#fff', color: '#111827' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
            onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
            Reset filters
          </button>
        </div>
      </div>

      {/* ── Count ── */}
      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
        {loading ? 'Loading…' : total === 0 ? 'No results' : `${total} article${total !== 1 ? 's' : ''} · page ${currentPage} of ${totalPages}`}
      </div>

      {/* ── Mobile cards ── */}
      <div className="nt-mobile">
        {loading ? (
          <div style={{ padding: '14px', borderRadius: 12, border: '1px solid #e5e7eb', background: '#f9fafb', color: '#6b7280', fontSize: 13 }}>Loading…</div>
        ) : paged.length === 0 ? (
          <div style={{ padding: '14px', borderRadius: 12, border: '1px solid #e5e7eb', background: '#f9fafb', color: '#6b7280', fontSize: 13 }}>No news found</div>
        ) : paged.map((r) => (
          <div key={r.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, background: '#fff', color: '#111827' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
              <p style={{ fontWeight: 500, fontSize: 14, lineHeight: 1.4, margin: 0 }}>
                {pickL10n(r.title, lang) || '—'}
              </p>
              {r.featured && (
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: '#dcfce7', color: '#16a34a', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  Featured
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 6 }}>
              {formatLocaleDate(r.dateYMD, lang)}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={() => onEdit(r)} style={{ ...btnBase, flex: 1 }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>Edit</button>
              <button onClick={() => { if (window.confirm('Delete this article?')) onDelete(r.id); }}
                style={{ ...btnDanger, flex: 1 }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
                onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop table ── */}
      <div className="nt-desktop" style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#374151', width: '50%' }}>Title</th>
                <th style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#374151', width: '15%' }}>Date</th>
                <th style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#374151', width: '10%' }}>Featured</th>
                <th style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: '#374151', width: '25%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: '16px 14px', color: '#6b7280', fontSize: 14 }}>Loading…</td></tr>
              ) : paged.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '16px 14px', color: '#6b7280', fontSize: 14 }}>No news found</td></tr>
              ) : paged.map((r, i) => (
                <tr key={r.id} style={{ borderTop: '1px solid #f3f4f6', background: i % 2 === 0 ? '#fff' : '#fafafa', color: '#111827' }}>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ fontWeight: 500, fontSize: 14, lineHeight: 1.4 }}>
                      {pickL10n(r.title, lang) || '—'}
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#6b7280', whiteSpace: 'nowrap' }}>
                    {formatLocaleDate(r.dateYMD, lang)}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 13 }}>
                    {r.featured
                      ? <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: '#dcfce7', color: '#16a34a' }}>Yes</span>
                      : <span style={{ color: '#9ca3af' }}>—</span>}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => onEdit(r)} style={btnBase}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>Edit</button>
                      <button onClick={() => { if (window.confirm('Delete this article?')) onDelete(r.id); }}
                        style={btnDanger}
                        onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination ── */}
      {!loading && totalPages > 1 && (
        <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <p style={{ fontSize: 12, color: '#9ca3af' }}>
            Showing {(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, total)} of {total}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button disabled={currentPage <= 1} onClick={() => goToPage(currentPage - 1)}
              style={{ ...btnBase, opacity: currentPage <= 1 ? 0.4 : 1, cursor: currentPage <= 1 ? 'not-allowed' : 'pointer' }}>← Prev</button>

            {pageNumbers(totalPages, currentPage).map((n, idx) =>
              n === '…'
                ? <span key={`e${idx}`} style={{ padding: '6px 4px', color: '#9ca3af', fontSize: 13 }}>…</span>
                : <button key={n} onClick={() => goToPage(n as number)}
                    style={{ ...btnBase, borderColor: n === currentPage ? '#2563eb' : '#d1d5db', background: n === currentPage ? '#2563eb' : '#fff', color: n === currentPage ? '#fff' : '#374151', padding: '6px 12px' }}>
                    {n}
                  </button>
            )}

            <button disabled={currentPage >= totalPages} onClick={() => goToPage(currentPage + 1)}
              style={{ ...btnBase, opacity: currentPage >= totalPages ? 0.4 : 1, cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer' }}>Next →</button>
          </div>
        </div>
      )}
    </div>
  );
};
