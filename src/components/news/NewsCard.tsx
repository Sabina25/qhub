import { Link } from 'react-router-dom';
import type { NewsCardVM } from '../../hooks/useAllNews';

function formatLocal(ymd?: string) {
  if (!ymd) return '—';
  const [y, m, d] = ymd.split('-').map(Number);
  if (!y || !m || !d) return '—';
  return new Date(y, m - 1, d).toLocaleDateString();
}

export const NewsCard = ({
  item,
  featuredLabel,
  categoryLabel,
}: {
  item: NewsCardVM;
  featuredLabel: string;
  categoryLabel?: string;
}) => (
  <Link to={`/events/${item.id}`} className="relative block transform transition-transform duration-300 hover:scale-105 rounded">
    {item.featured && (
      <span className="pointer-events-none absolute top-2 right-2 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">
        {featuredLabel}
      </span>
    )}

    {item.image ? (
      <img src={item.image} alt={item.title} className="w-full h-48 object-cover mb-4 rounded" loading="lazy" />
    ) : (
      <div className="w-full h-48 bg-gray-100 mb-4 rounded" />
    )}

    <h2 className="font-raleway text-2xl mb-2 line-clamp-2">{item.title || '—'}</h2>

    <div className="flex justify-between items-center text-sm text-gray-500">
      <span>{formatLocal(item.dateYMD)}</span>
      {categoryLabel && <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600">{categoryLabel}</span>}
    </div>
  </Link>
);
