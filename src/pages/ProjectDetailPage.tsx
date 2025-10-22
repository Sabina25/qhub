import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { Share2, Copy as CopyIcon, Check as CheckIcon } from 'lucide-react';

import Header from '../components/header/Header';
import Footer from '../components/Footer';
import RelatedProjects from '../components/RelatedProjects';
import { useTranslation } from '../context/TranslationContext';
import VideoGallery from '../components/VideoGallery';

import { fetchProjectById, fetchProjects, ProjectDoc } from '../data/projects';
import { buildShareUrl } from '../utils/share';

// --- helpers ---
type Lang = 'ua' | 'en';

function pickL10n(val: any, lang: Lang): string {
  if (typeof val === 'string') return val;
  if (val && typeof val === 'object') return val[lang] ?? val.ua ?? val.en ?? '';
  return '';
}

function enhanceHtml(html: string) {
  const clean = DOMPurify.sanitize(html || '', { ADD_ATTR: ['target', 'rel'] });
  const doc = new DOMParser().parseFromString(clean, 'text/html');
  doc.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href && !/^(https?:|mailto:|tel:|\/|#)/i.test(href)) {
      a.setAttribute('href', 'https://' + href);
    }
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });
  return doc.body.innerHTML;
}

function formatYMD(ymd?: string, locale = 'uk-UA') {
  if (!ymd) return '';
  const [y, m, d] = (ymd || '').split('-').map(Number);
  if (!y || !m || !d) return '';
  return new Date(y, m - 1, d).toLocaleDateString(locale);
}

function formatRange(p: ProjectDoc, locale: string) {
  if (p.dateYMD) return formatYMD(p.dateYMD, locale);
  if (p.dateStartYMD && p.dateEndYMD) {
    return `${formatYMD(p.dateStartYMD, locale)} – ${formatYMD(p.dateEndYMD, locale)}`;
  }
  return formatYMD(p.dateStartYMD || p.dateEndYMD, locale);
}

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { lang, t } = useTranslation();
  const locale = lang === 'ua' ? 'uk-UA' : 'en-GB';

  const [proj, setProj] = useState<ProjectDoc | null>(null);
  const [related, setRelated] = useState<ProjectDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);      // для тоста над Copy
  const [justShared, setJustShared] = useState(false); // опционально подсветим share-иконку

  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchProjectById(id);
        setProj(data);
        const all = await fetchProjects();
        const others = all.filter((p) => p.id !== id);
        const shuffled = others.sort(() => 0.5 - Math.random());
        setRelated(shuffled.slice(0, 3));
      } catch (e: any) {
        console.error(e);
        setErr(e?.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const title = useMemo(() => pickL10n(proj?.title, lang as Lang), [proj?.title, lang]);
  const location = useMemo(() => pickL10n((proj as any)?.location, lang as Lang), [proj?.location, lang]);
  const descHtml = useMemo(() => pickL10n((proj as any)?.descriptionHtml, lang as Lang), [proj?.descriptionHtml, lang]);
  const sanitizedHtml = useMemo(() => enhanceHtml(descHtml || ''), [descHtml]);

  const dateStr = useMemo(() => (proj ? formatRange(proj, locale) : ''), [proj, locale]);
  const allVideoUrls = useMemo(() => proj?.youtubeUrls || [], [proj?.youtubeUrls]);

  // --- share (cache-buster + язык) ---
  const shareVersion = useMemo(
    () => (proj as any)?.updatedAtTs?.toString?.() || proj?.dateYMD || '',
    [proj]
  );
  const shareUrl = useMemo(
    () => buildShareUrl(`/projects/${id}`, { version: shareVersion, lang }),
    [id, shareVersion, lang]
  );

  // копирование без alert; показываем над иконкой на 2 сек "Copied"
  const showCopiedToast = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const copyShareUrl = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(showCopiedToast)
      .catch(() => {
        // редкий случай: нет clipboard API — fallback через input
        try {
          const ta = document.createElement('textarea');
          ta.value = shareUrl;
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showCopiedToast();
        } catch {
          // если вообще не вышло — просто ничего не делаем
        }
      });
  };

  const webShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: title || 'Q-hub', text: title || '', url: shareUrl });
        setJustShared(true);
        window.setTimeout(() => setJustShared(false), 2000);
      } catch {
        /* cancelled — игнорируем */
      }
    } else {
      // если нет Web Share API — просто копируем
      copyShareUrl();
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-20">Loading…</div>;
  if (err) return <div className="max-w-4xl mx-auto px-4 py-20 text-red-600">{err}</div>;
  if (!proj) return <div className="max-w-4xl mx-auto px-4 py-20">Project not found</div>;

  return (
    <>
      <Header appearance="solid" />
      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Cover */}
        {proj.image && (
          <div className="relative h-72 sm:h-96 lg:h-[520px] overflow-hidden rounded-xl">
            <img
              src={proj.image}
              alt={title || 'project cover'}
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>
        )}

        {/* Back Button */}
        <Link to="/projects" className="text-blue-600 underline inline-block py-8">
          ← {t('projects.back') || 'Back to Projects'}
        </Link>

        <h1 className="text-4xl font-bold mt-4 mb-2">{title || '—'}</h1>

        {/* Share (только иконки, без видимой ссылки) */}
        <div className="mb-6 flex items-center gap-2">
          {/* Share icon */}
          <button
            onClick={webShare}
            className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40`}
            aria-label={lang === 'ua' ? 'Поділитись' : 'Share'}
            title={lang === 'ua' ? 'Поділитись' : 'Share'}
          >
            <Share2 className={`h-4 w-4 ${justShared ? 'scale-110' : ''}`} />
          </button>

          {/* Copy icon with tooltip */}
          <div className="relative">
            <button
              onClick={copyShareUrl}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
              aria-label={lang === 'ua' ? 'Скопіювати посилання' : 'Copy link'}
              title={lang === 'ua' ? 'Скопіювати посилання' : 'Copy link'}
            >
              {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
            </button>

            {/* mini toast "Copied" */}
            {copied && (
              <div
                role="status"
                className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-black/80 text-white text-xs px-2 py-1 pointer-events-none select-none"
              >
                Copied
                <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 border-4 border-transparent border-t-black/80" />
              </div>
            )}
          </div>
        </div>

        {(dateStr || location) && (
          <p className="text-gray-500 mb-6">
            {dateStr && <span>{dateStr}</span>}
            {dateStr && location && <span className="mx-2">•</span>}
            {location && <span>{location}</span>}
          </p>
        )}

        <div
          className="
            prose prose-lg max-w-none text-gray-800 leading-relaxed
            prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-700
            prose-a:underline-offset-2 prose-a:decoration-2
          "
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />

        {/* Gallery */}
        {proj.gallery && proj.gallery.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">{lang === 'ua' ? 'Галерея' : 'Gallery'}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {proj.gallery.map((src, i) => (
                <img key={i} src={src} className="w-full h-40 md:h-48 object-cover rounded-lg" loading="lazy" />
              ))}
            </div>
          </section>
        )}

        {/* Videos */}
        {allVideoUrls.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">{lang === 'ua' ? 'Відео' : 'Videos'}</h2>
            <VideoGallery urls={allVideoUrls} />
          </section>
        )}

        {/* Related Projects */}
        <RelatedProjects currentId={id!} limit={3} className="mt-16" />
      </main>

      <Footer />
    </>
  );
};

export default ProjectDetailPage;
