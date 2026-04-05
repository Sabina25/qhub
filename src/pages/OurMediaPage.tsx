import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from '../context/TranslationContext';

import Header from '../components/header/Header';
import Footer from '../components/Footer';

import { useYouTubeFeed } from '../hooks/useYouTubeFeed';
import { ShortsRail } from '../components/media/ShortsRail';
import { VideoGrid } from '../components/media/VideoGrid';
import { VideoLightbox } from '../components/media/VideoLightbox';
import { VideoCard } from '../types/youtube';

const Q = { teal: '#4db8b8', teal2: '#2d7d9a', text: '#e8f4f4', muted: 'rgba(200,230,230,0.6)' };

const YT_API_KEY  = import.meta.env.VITE_YT_API_KEY  ?? 'AIzaSyDYX3_pppGQYuCTcKJaZgyg9fWZ6FBRI1A';
const CHANNEL_ID  = import.meta.env.VITE_YT_CHANNEL_ID ?? 'UCm-C1Ix_tf4PnuROw8QRqTg';

/* ── Skeleton ── */
const Skeleton = ({ w, h }: { w?: string; h?: number }) => (
  <div style={{
    width: w ?? '100%', height: h ?? 200,
    borderRadius: 14, flexShrink: 0,
    background: 'rgba(77,184,184,0.06)',
    border: '0.5px solid rgba(77,184,184,0.1)',
  }} />
);

/* ── Section header ── */
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: 20 }}>
    <h2 className="font-raleway" style={{ fontSize: 22, fontWeight: 600, color: Q.text, marginBottom: 8 }}>
      {children}
    </h2>
    <div style={{ width: 32, height: 2, background: `linear-gradient(90deg,${Q.teal},${Q.teal2})`, borderRadius: 2 }} />
  </div>
);

const OurMediaPage = () => {
  const { lang, t } = useTranslation();
  const { shorts, longs, loading, err } = useYouTubeFeed(YT_API_KEY, CHANNEL_ID);

  const [open, setOpen]         = useState(false);
  const [selected, setSelected] = useState<{ id: string; isShort: boolean; title?: string } | null>(null);

  const openVideo  = useCallback((v: VideoCard) => { setSelected({ id: v.id, isShort: v.isShort, title: v.title }); setOpen(true); }, []);
  const closeVideo = useCallback(() => setOpen(false), []);

  const Hero = useMemo(() => (
    <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto', padding: '0 16px' }}>
      {/* Eyebrow */}
      <h1 className="font-raleway" style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 700, color: Q.text, marginBottom: 16 }}>
        {t('media.title') || 'Наше ЗМІ'}
      </h1>
      <div style={{ width: 40, height: 2, background: `linear-gradient(90deg,${Q.teal},${Q.teal2})`, borderRadius: 2, margin: '0 auto 20px' }} />

      {/* Crimea Vox badge */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 18px', borderRadius: 30, background: 'rgba(77,184,184,0.08)', border: '0.5px solid rgba(77,184,184,0.25)', marginBottom: 16 }}>
        <span style={{ fontWeight: 700, color: Q.teal, fontSize: 14 }}>Crimea Vox</span>
        <span style={{ width: 1, height: 14, background: 'rgba(77,184,184,0.3)' }} />
        <span style={{ fontSize: 13, color: Q.muted }}>{t('media.info')}</span>
      </div>

      <p style={{ fontSize: 14, lineHeight: 1.75, color: Q.muted }}>
        {t('media.info2')}
      </p>
    </div>
  ), [lang]);

  return (
    <div style={{ minHeight: '100vh', background: '#080c14', display: 'flex', flexDirection: 'column' }}>
      <Header appearance="solid" />

      <main style={{ flex: 1, maxWidth: 1200, width: '100%', margin: '0 auto', padding: '100px 24px 60px' }}>

        {/* Hero */}
        {Hero}

        {/* Divider */}
        <div style={{ height: '0.5px', background: 'rgba(77,184,184,0.12)', margin: '48px 0' }} />

        {/* Error */}
        {err && (
          <div style={{ marginBottom: 24, padding: '12px 16px', borderRadius: 12, background: 'rgba(255,80,80,0.08)', border: '0.5px solid rgba(255,100,100,0.25)', color: '#f87171', fontSize: 14 }}>
            {err}
          </div>
        )}

        {/* ── SHORTS ── */}
        <section style={{ marginBottom: 56 }}>
          <SectionTitle>Shorts</SectionTitle>

          {loading ? (
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} w="180px" h={320} />
              ))}
            </div>
          ) : (
            <ShortsRail items={shorts} onOpen={openVideo} />
          )}
        </section>

        {/* ── LONGS ── */}
        <section style={{ marginBottom: 56 }}>
          <SectionTitle>{t('media.latest_videos')}</SectionTitle>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} h={220} />
              ))}
            </div>
          ) : (
            <VideoGrid items={longs} onOpen={openVideo} title={t('media.latest_videos')} />
          )}
        </section>

        {/* Lightbox */}
        <VideoLightbox
          open={open}
          onClose={closeVideo}
          videoId={selected?.id ?? null}
          isShort={!!selected?.isShort}
          title={selected?.title}
        />
      </main>

      <Footer />
    </div>
  );
};

export default OurMediaPage;
