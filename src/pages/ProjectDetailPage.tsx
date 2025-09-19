import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';

import Header from '../components/header/Header';
import Footer from '../components/Footer';
import { useTranslation } from '../context/TranslationContext';
import VideoGallery from '../components/VideoGallery';

import { fetchProjectById, ProjectDoc } from '../data/projects';

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
  const [y, m, d] = ymd.split('-').map(Number);
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

// --- нормализация YouTube ссылок ---
function extractYouTubeId(raw: string): string | null {
  if (!raw) return null;
  const s = raw.trim();

  const mShort = s.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (mShort?.[1]) return mShort[1];

  const mShorts = s.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{6,})/);
  if (mShorts?.[1]) return mShorts[1];

  const mEmbed = s.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/);
  if (mEmbed?.[1]) return mEmbed[1];

  try {
    const url = new URL(s);
    const v = url.searchParams.get('v');
    if (v) return v;
  } catch {
    try {
      const url2 = new URL('https://' + s);
      const v2 = url2.searchParams.get('v');
      if (v2) return v2;
    } catch {}
  }

  return null;
}

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { lang } = useTranslation(); // 'ua' | 'en'
  const locale = lang === 'ua' ? 'uk-UA' : 'en-GB';

  const [proj, setProj] = useState<ProjectDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchProjectById(id);
        setProj(data);
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

        <h1 className="text-4xl font-bold mt-8 mb-2">{title || '—'}</h1>

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
            <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
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
            <h2 className="text-2xl font-semibold mb-4">Videos</h2>
            <VideoGallery urls={allVideoUrls} />
          </section>
        )}
      </main>

      <Footer />
    </>
  );
};

export default ProjectDetailPage;
