import { memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/TranslationContext';
import type { ProjectCardVM } from '../hooks/useAllProjects';
import { pickL10nWithLang } from '../utils/l10n';
import DOMPurify from 'dompurify';

function stripHtmlToText(html: string, max = 220): string {
  if (!html) return '';
  const clean = DOMPurify.sanitize(html);
  const tmp = document.createElement('div');
  tmp.innerHTML = clean;
  const text = (tmp.textContent || '').trim().replace(/\s+/g, ' ');
  return text.length > max ? text.slice(0, max - 1) + '…' : text;
}
function formatYMD(ymd?: string, locale = 'uk-UA') {
  if (!ymd) return '';
  const [y, m, d] = (ymd || '').split('-').map(Number);
  if (!y || !m || !d) return '';
  return new Date(y, m - 1, d).toLocaleDateString(locale);
}
function formatRange(p: ProjectCardVM, locale: string) {
  if (p.dateYMD) return formatYMD(p.dateYMD, locale);
  if (p.dateStartYMD && p.dateEndYMD) {
    return `${formatYMD(p.dateStartYMD, locale)} – ${formatYMD(p.dateEndYMD, locale)}`;
  }
  return formatYMD(p.dateStartYMD || p.dateEndYMD, locale);
}

export const ProjectCard = memo(function ProjectCard({
  item,
  locale = 'en-GB',
  basePath = '/projects',
  className = '',
}: {
  item: ProjectCardVM;
  locale?: string;
  basePath?: string;
  className?: string;
}) {
  const { lang } = useTranslation();



  const { text: title, used: titleUsed } = pickL10nWithLang(item.titleRaw, lang);
  const { text: location } = pickL10nWithLang(item.locationRaw, lang);
  const { text: descHtml } = pickL10nWithLang(item.descriptionHtmlRaw, lang);

  const descText = stripHtmlToText(descHtml || '');
  const dateStr = formatRange(item, locale);

  console.log('lang lang lang: ', descText)

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.debug('[ProjectCard]', { id: item.id, lang, titleUsed, title });
  }, [item.id, lang, titleUsed, title]);

  return (
    <Link
      to={`${basePath}/${item.id}`}
      className={`bg-white rounded-lg shadow p-6 transform transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      {titleUsed && titleUsed !== lang && (
        <span className="absolute top-3 right-3 z-10 px-2 py-0.5 text-xs rounded bg-amber-100 text-amber-700 shadow">
          {titleUsed.toUpperCase()} fallback
        </span>
      )}

      <div className="relative h-48 w-full overflow-hidden rounded mb-4">
        {item.image ? (
          <img
            src={item.image}
            alt={title || 'project cover'}
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-200" />
        )}
      </div>

      <h2 className="text-2xl font-bold mb-2 line-clamp-2">{title || '—'}</h2>

      {(dateStr || location) && (
        <div className="text-sm text-gray-500 mb-2">
          {dateStr && <span>{dateStr}</span>}
          {dateStr && location && <span className="mx-2">•</span>}
          {location && <span>{location}</span>}
        </div>
      )}

      {/* <p className="text-gray-700 mb-3 line-clamp-3">{descText}</p> */}
    </Link>
  );
});
