import React, { useEffect, useMemo, useState } from 'react';
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
};

function Autoplay(ms = 6000) {
  return (slider: any) => {
    let timeout: any;
    let mouseOver = false;
    const clear = () => timeout && clearTimeout(timeout);
    const next = () => { clear(); if (!mouseOver && slider) timeout = setTimeout(() => slider.next(), ms); };
    slider.on('created', () => {
      slider.container.addEventListener('mouseover', () => { mouseOver = true; clear(); });
      slider.container.addEventListener('mouseout', () => { mouseOver = false; next(); });
      next();
    });
    slider.on('dragStarted', clear);
    slider.on('animationEnded', next);
    slider.on('updated', next);
    slider.on('destroyed', clear);
  };
}

function ScaleSlides() {
  return (slider: any) => {
    const apply = () => {
      const rel = slider.track.details.rel;
      const total = slider.slides.length;
      slider.slides.forEach((el: HTMLElement, i: number) => {
        let dist = Math.abs(i - rel);
        if (slider.options.loop) dist = Math.min(dist, total - dist);
        const scale = 1 - Math.min(0.18, dist * 0.12);
        const opacity = 0.6 + (scale - 0.82) * 1.2;
        el.style.transform = `scale(${scale})`;
        el.style.opacity = String(Math.max(0.4, Math.min(1, opacity)));
      });
    };
    slider.on('created', apply);
    slider.on('detailsChanged', apply);
  };
}

// автоформат "YYYY-MM-DD" -> локальная дата; иначе — как есть
function defaultFormatDate(d: string | Date, _i: number) {
  if (d instanceof Date) return d.toLocaleDateString();
  const m = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    const [_, y, mo, da] = m;
    return new Date(Number(y), Number(mo) - 1, Number(da)).toLocaleDateString();
  }
  return d; // уже отформатировано человеком
}

const placementToClass: Record<NonNullable<FancyCarouselProps['datePlacement']>, string> = {
  'top-left': 'top-3 left-3',
  'top-right': 'top-3 right-3',
  'bottom-left': 'bottom-3 left-3',
  'bottom-right': 'bottom-3 right-3',
};

export const FancyCarousel: React.FC<FancyCarouselProps> = ({
  children,
  autoplayMs = 6000,
  className = '',
  dates,
  formatDate = defaultFormatDate,
  datePlacement = 'top-right',
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
    [Autoplay(autoplayMs), ScaleSlides()]
  );

  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setProgress((p) => (p >= 100 ? 0 : p + 2)), 120);
    return () => clearInterval(id);
  }, []);
  useEffect(() => setProgress(0), [current]);

  const dateChip =
    dates && dates.length > 0 && dates[current] != null
      ? formatDate(dates[current]!, current)
      : null;

  return (
    <div className={`relative ${className}`}>
      {/* Слайдер */}
      <div ref={sliderRef} className="keen-slider">
        {React.Children.map(children, (child, i) => (
          <div className="keen-slider__slide p-1">
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white ring-1 ring-black/5 transition-transform will-change-transform">
              {dateChip && current === i && (
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
        onClick={() => instanceRef.current?.prev()}
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg hover:scale-105 transition z-20 hidden md:inline-flex"
        aria-label="Prev"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        type="button"
        onClick={() => instanceRef.current?.next()}
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg hover:scale-105 transition z-20 hidden md:inline-flex"
        aria-label="Next"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Точки */}
      <div className="mt-4 flex justify-center gap-2">
        {Array.from({ length: slidesCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => instanceRef.current?.moveToIdx(i)}
            className={`h-2 w-2 rounded-full transition ${
              current === i ? 'w-6 bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Прогресс автоплея */}
      <div className="mx-auto mt-3 h-1 w-40 overflow-hidden rounded bg-gray-200">
        <div className="h-full bg-blue-600 transition-[width]" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};
