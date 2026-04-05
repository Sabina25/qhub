import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'keen-slider/keen-slider.min.css';

type FancyCarouselProps = {
  children: React.ReactNode[];
  autoplayMs?: number;
  className?: string;
  dates?: Array<string | Date>;
  formatDate?: (d: string | Date, index: number) => string;
  datePlacement?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  pauseOnHover?: boolean;
  showOverlayDate?: boolean;
  fixedHeight?: string;
};

function ScaleSlides({ dimInactive = false } = {}) {
  return (slider: any) => {
    const apply = () => {
      const rel = slider.track.details.rel;
      const total = slider.slides.length;
      slider.slides.forEach((el: HTMLElement, i: number) => {
        let dist = Math.abs(i - rel);
        if (slider.options.loop) dist = Math.min(dist, total - dist);
        const isActive = dist === 0;
        const scale = isActive ? 1 : 1 - Math.min(0.12, dist * 0.08);
        el.style.transform = `scale(${scale})`;
        el.style.opacity = dimInactive ? (isActive ? '1' : String(Math.max(0.7, 1 - dist * 0.25))) : '1';
      });
    };
    slider.on('created', apply);
    slider.on('detailsChanged', apply);
  };
}

function defaultFormatDate(d: string | Date) {
  if (d instanceof Date) return d.toLocaleDateString();
  const m = typeof d === 'string' ? d.match(/^(\d{4})-(\d{2})-(\d{2})$/) : null;
  if (m) {
    const [_, y, mo, da] = m;
    return new Date(+y, +mo - 1, +da).toLocaleDateString();
  }
  return String(d);
}

const placementToClass = {
  'top-left': 'top-3 left-3',
  'top-right': 'top-3 right-3',
  'bottom-left': 'bottom-3 left-3',
  'bottom-right': 'bottom-3 right-3',
} as const;

const Q = {
  teal: '#4db8b8',
  teal2: '#2d7d9a',
  border: 'rgba(77,184,184,0.18)',
  borderHover: 'rgba(77,184,184,0.4)',
};

export const FancyCarousel: React.FC<FancyCarouselProps> = ({
  children,
  autoplayMs = 6000,
  className = '',
  dates,
  formatDate = defaultFormatDate,
  datePlacement = 'top-right',
  pauseOnHover = true,
  showOverlayDate = false,
  fixedHeight,
}) => {
  const [current, setCurrent] = useState(0);
  const slidesCount = useMemo(() => React.Children.count(children), [children]);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      renderMode: 'precision',
      defaultAnimation: { duration: 700, easing: (t) => 1 - Math.pow(1 - t, 3) },
      slides: { perView: 1, spacing: 24 },
      created: (s) => setCurrent(s.track.details.rel),
      slideChanged: (s) => setCurrent(s.track.details.rel),
      breakpoints: { '(min-width: 1024px)': { slides: { perView: 1, spacing: 32 } } },
    },
    [ScaleSlides({ dimInactive: false })]
  );

  const [progress, setProgress] = useState(0);
  const pausedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    const onVis = () => { pausedRef.current = document.hidden; };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    startRef.current = performance.now();
    setProgress(0);
  }, [current, autoplayMs]);

  useEffect(() => {
    const tick = (t: number) => {
      const inst = instanceRef.current;
      if (!inst) { rafRef.current = requestAnimationFrame(tick); return; }
      if (!pausedRef.current) {
        const elapsed = t - startRef.current;
        const p = Math.min(100, (elapsed / autoplayMs) * 100);
        setProgress(p);
        if (elapsed >= autoplayMs) {
          inst.next();
          startRef.current = t;
          setProgress(0);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [instanceRef, autoplayMs]);

  const wrapperProps = pauseOnHover
    ? {
        onMouseEnter: () => { pausedRef.current = true; },
        onMouseLeave: () => { pausedRef.current = false; startRef.current = performance.now(); setProgress(0); },
        onTouchStart: () => { pausedRef.current = true; },
        onTouchEnd:   () => { pausedRef.current = false; startRef.current = performance.now(); setProgress(0); },
      }
    : {};

  const dateChip =
    dates && dates.length > 0 && dates[current] != null
      ? formatDate(dates[current]!, current)
      : null;

  const prev = () => { instanceRef.current?.prev(); startRef.current = performance.now(); setProgress(0); };
  const next = () => { instanceRef.current?.next(); startRef.current = performance.now(); setProgress(0); };

  return (
    <div className={`relative ${className}`} {...wrapperProps}>

      {/* ── Слайдер ── */}
      <div ref={sliderRef} className="keen-slider">
        {React.Children.map(children, (child, i) => (
          <div key={i} className="keen-slider__slide p-1">
            <div
              className={`relative rounded-2xl overflow-hidden will-change-transform transition-transform ${fixedHeight ?? ''}`}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `0.5px solid ${Q.border}`,
                boxShadow: 'none',
              }}
            >
              {showOverlayDate && dateChip && current === i && (
                <div className={`absolute ${placementToClass[datePlacement]} z-20`}>
                  <span style={{
                    borderRadius: 20,
                    background: 'rgba(13,17,23,0.75)',
                    backdropFilter: 'blur(8px)',
                    border: `0.5px solid ${Q.border}`,
                    padding: '4px 12px',
                    fontSize: 12,
                    color: Q.teal,
                    fontWeight: 500,
                  }}>
                    {dateChip}
                  </span>
                </div>
              )}
              {child}
            </div>
          </div>
        ))}
      </div>

      {/* ── Стрелка влево ── */}
      <button
        type="button"
        onClick={prev}
        aria-label="Prev"
        className="absolute top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center transition-all duration-200"
        style={{
          left: -18,
          width: 36, height: 36,
          borderRadius: '50%',
          background: 'rgba(13,17,23,0.8)',
          border: `0.5px solid ${Q.border}`,
          color: Q.teal,
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = Q.borderHover;
          e.currentTarget.style.background = 'rgba(77,184,184,0.12)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = Q.border;
          e.currentTarget.style.background = 'rgba(13,17,23,0.8)';
        }}
      >
        <ChevronLeft style={{ width: 18, height: 18 }} />
      </button>

      {/* ── Стрелка вправо ── */}
      <button
        type="button"
        onClick={next}
        aria-label="Next"
        className="absolute top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center justify-center transition-all duration-200"
        style={{
          right: -18,
          width: 36, height: 36,
          borderRadius: '50%',
          background: 'rgba(13,17,23,0.8)',
          border: `0.5px solid ${Q.border}`,
          color: Q.teal,
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = Q.borderHover;
          e.currentTarget.style.background = 'rgba(77,184,184,0.12)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = Q.border;
          e.currentTarget.style.background = 'rgba(13,17,23,0.8)';
        }}
      >
        <ChevronRight style={{ width: 18, height: 18 }} />
      </button>

      {/* ── Доты + прогресс-бар ── */}
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>

        {/* Прогресс текущего слайда */}
        <div style={{ width: 120, height: 2, borderRadius: 2, background: 'rgba(77,184,184,0.12)', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${Q.teal2}, ${Q.teal})`,
            borderRadius: 2,
            transition: 'width 0.1s linear',
          }} />
        </div>

        {/* Доты */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {Array.from({ length: slidesCount }).map((_, i) => {
            const isActive = i === (current % slidesCount);
            return (
              <button
                key={i}
                onClick={() => { instanceRef.current?.moveToIdx(i); startRef.current = performance.now(); setProgress(0); }}
                aria-label={`Go to slide ${i + 1}`}
                style={{
                  height: 5,
                  width: isActive ? 20 : 5,
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  background: isActive
                    ? `linear-gradient(90deg, ${Q.teal2}, ${Q.teal})`
                    : 'rgba(77,184,184,0.22)',
                  transition: 'width 0.3s, background 0.3s',
                }}
              />
            );
          })}
        </div>

      </div>
    </div>
  );
};
