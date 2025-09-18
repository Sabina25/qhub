import { Link } from 'react-router-dom';
import { useTranslation } from '../../context/TranslationContext';
import type { NewsCardVM } from '../../hooks/useAllNews';
import { pickL10nKeepEmpty } from '../../utils/l10n';

function formatLocal(ymd?: string, locale = 'en-GB') {
  if (!ymd) return '—';
  const [y, m, d] = (ymd || '').split('-').map(Number);
  if (!y || !m || !d) return '—';
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(y, m - 1, d));
}

export const NewsCard = ({
  item,
  featuredLabel,
  categoryLabel,
  locale = 'en-GB',
}: {
  item: NewsCardVM;
  featuredLabel: string;
  categoryLabel?: string;
  locale?: string;
}) => {
  const { lang } = useTranslation();
  const { text: title } = pickL10nKeepEmpty(item.titleRaw, lang);

  console.debug('NewsCard raw:', {
    id: item.id,
    titleRaw: item.titleRaw,
  });

  return (
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
        <img src={item.image} alt={title || 'news cover'} className="w-full h-48 object-cover mb-4" loading="lazy" />
      ) : (
        <div className="w-full h-48 bg-gray-100 mb-4" />
      )}

      <h2 className="font-raleway text-2xl mb-2 line-clamp-2">{title || '—'}</h2>


      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{formatLocal(item.dateYMD, locale)}</span>
      </div>
    </Link>
  );
};
