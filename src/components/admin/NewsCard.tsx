import { Link } from 'react-router-dom';
import type { NewsCardVM } from '../../hooks/useAllNews';

function formatLocal(ymd?: string) {
  if (!ymd) return '—';
  const [y, m, d] = (ymd || '').split('-').map(Number);
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
  <Link
    to={`/events/${item.id}`}
    className="relative block transform transition-transform duration-300 hover:scale-105 rounded overflow-hidden"
  >
    <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-2">
      {categoryLabel && (
        <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-xs font-semibold shadow-sm">
          {categoryLabel}
        </span>
      )}
      {item.featured && (
        <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-semibold shadow-sm">
          {featuredLabel}
        </span>
      )}
    </div>
    {item.image ? (
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-48 object-cover mb-4"
        loading="lazy"
      />
    ) : (
      <div className="w-full h-48 bg-gray-100 mb-4" />
    )}
    <h2 className="font-raleway text-2xl mb-2 line-clamp-2">{item.title || '—'}</h2>

    <div className="flex justify-between items-center text-sm text-gray-500">
      <span>{formatLocal(item.dateYMD)}</span>
    </div>
  </Link>
);
