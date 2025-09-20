import { Link } from 'react-router-dom';
import { useTranslation } from '../context/TranslationContext';

type Lang = 'ua' | 'en';
export type ProjectCardVM = {
  id: string;
  title: any;           
  image?: string;
  dateYMD?: string;
  dateStartYMD?: string;
  dateEndYMD?: string;
  categoryKey?: string;
  featured?: boolean;
};

function pickL10n(val: any, lang: Lang): string {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') return val[lang] ?? val.ua ?? val.en ?? '';
  return '';
}

function toLocalDate(ymd?: string, locale = 'en-GB') {
  if (!ymd) return '—';
  const [y, m, d] = (ymd || '').split('-').map(Number);
  if (!y || !m || !d) return '—';
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' })
    .format(new Date(y, m - 1, d));
}

function formatRange(p: ProjectCardVM, locale: string) {
  if (p.dateYMD) return toLocalDate(p.dateYMD, locale);
  if (p.dateStartYMD && p.dateEndYMD) {
    return `${toLocalDate(p.dateStartYMD, locale)} – ${toLocalDate(p.dateEndYMD, locale)}`;
  }
  return toLocalDate(p.dateStartYMD || p.dateEndYMD, locale);
}

export const RelatedProjectCard = ({
  item,
  categoryLabel,
  featuredLabel,
  locale = 'en-GB',
}: {
  item: ProjectCardVM;
  categoryLabel?: string;
  featuredLabel?: string;
  locale?: string;
}) => {
  const { lang } = useTranslation();
  const title = pickL10n(item.title, lang as Lang);

  return (
    <Link
      to={`/projects/${item.id}`}
      className="relative block transform transition-transform duration-300 hover:scale-105 rounded overflow-hidden"
    >
      <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-2">
        {categoryLabel && (
          <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-xs font-semibold shadow-sm">
            {categoryLabel}
          </span>
        )}
        {item.featured && featuredLabel && (
          <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 text-xs font-semibold shadow-sm">
            {featuredLabel}
          </span>
        )}
      </div>

      {item.image ? (
        <img
          src={item.image}
          alt={title || 'project cover'}
          className="w-full h-48 object-cover mb-4"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 mb-4" />
      )}

      <h2 className="font-raleway text-2xl mb-2 line-clamp-2">{title || '—'}</h2>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>{formatRange(item, locale)}</span>
      </div>
    </Link>
  );
};
