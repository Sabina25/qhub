import { Link } from 'react-router-dom';
import { NewsCardVM } from '../../hooks/useAllNews';

export const NewsCard = ({
  item,
  featuredLabel = 'Featured',
  categoryLabel,
  to = `/events/${''}`,
}: {
  item: NewsCardVM;
  featuredLabel?: string;
  categoryLabel?: string; 
  to?: string;            
}) => {
  const href = `/events/${item.id}`;

  return (
    <Link
      to={to || href}
      className="relative block transform transition-transform duration-300 hover:scale-105"
    >
      {item.featured && (
        <span className="absolute top-2 right-2 bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded">
          {featuredLabel}
        </span>
      )}

      {item.image ? (
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-48 object-cover mb-4 rounded"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 mb-4 rounded" />
      )}

      <h2 className="font-raleway text-2xl mb-2 line-clamp-2">{item.title || '—'}</h2>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{item.dateLabel}</span>
        {item.categoryKey && (
          <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600">
            {categoryLabel || item.categoryKey}
          </span>
        )}
      </div>
    </Link>
  );
};
