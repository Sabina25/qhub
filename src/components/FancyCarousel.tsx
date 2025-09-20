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
  showOverlayDate?: boolean;          // ← новое
  fixedHeight?: string;               // ← новое (например 'h-[460px]')
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
  const m = (typeof d === 'string') ? d.match(/^(\d{4})-(\d{2})-(\d{2})$/) : null;
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
        onTouchEnd: () => { pausedRef.current = false; startRef.current = performance.now(); setProgress(0); },
      }
    : {};

  const dateChip =
    dates && dates.length > 0 && dates[current] != null
      ? formatDate(dates[current]!, current)
      : null;

  return (
    <div className={`relative ${className}`} {...wrapperProps}>
      <div ref={sliderRef} className="keen-slider">
        {React.Children.map(children, (child, i) => (
          <div key={i} className="keen-slider__slide p-1">
            <div
              className={`relative rounded-2xl overflow-hidden shadow-xl bg-white ring-1 ring-black/5 transition-transform will-change-transform ${fixedHeight ?? ''}`}
            >
              {/* оверлей-дата отключается флагом */}
              {showOverlayDate && dateChip && current === i && (
                <div className={`absolute ${placementToClass[datePlacement]} z-20`}>
                  <span className="rounded-full bg-white/90 backdrop-blur px-3 py-1 text-sm font-medium text-gray-800 shadow">
                    {dateChip}
                  </span>
                </div>
              )}
              {child}
            </div>
          </div>
        ))}
      </div>

      {/* Стрелки */}
      <button
        type="button"
        onClick={() => { instanceRef.current?.prev(); startRef.current = performance.now(); setProgress(0); }}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg hover:scale-105 transition z-20 hidden md:inline-flex"
        aria-label="Prev"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        type="button"
        onClick={() => { instanceRef.current?.next(); startRef.current = performance.now(); setProgress(0); }}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg hover:scale-105 transition z-20 hidden md:inline-flex"
        aria-label="Next"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Дотсы */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: slidesCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => { instanceRef.current?.moveToIdx(i); startRef.current = performance.now(); setProgress(0); }}
            className={`h-2 w-2 rounded-full transition ${i === (current % slidesCount) ? 'w-6 bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
