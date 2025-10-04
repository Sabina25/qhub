import { useEffect, useMemo, useState } from "react";

type Slide = {
  imageSrc: string;
  startISO: string;
  name: string;
  text: string;
};

type Props = {
  slides: Slide[];
  interval?: number; 
  persist?: boolean;
  storageKey?: string;
  containerClass?: string;
};

export default function AnnouncementBarSlider({
  slides,
  interval = 8000,
  persist = false,
  storageKey = "announcement:slider",
  containerClass = "max-w-7xl"
}: Props) {
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!persist) return;
    try {
      const v = localStorage.getItem(storageKey);
      if (v === "closed") setVisible(false);
    } catch {}
  }, [persist, storageKey]);

  useEffect(() => {
    if (!persist) return;
    try {
      localStorage.setItem(storageKey, visible ? "open" : "closed");
    } catch {}
  }, [visible, persist, storageKey]);

  useEffect(() => {
    if (!visible || slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(id);
  }, [slides.length, interval, visible]);

  const days = useMemo(() => {
    const { startISO } = slides[index];
    const [y, m, d] = startISO.split("-").map(Number);
    const startUTC = Date.UTC(y, (m ?? 1) - 1, d);
    const now = new Date();
    const todayUTC = Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    );
    return Math.max(
      0,
      Math.floor((todayUTC - startUTC) / (1000 * 60 * 60 * 24))
    );
  }, [slides, index]);

  if (!visible) return null;

  const slide = slides[index];

  return (
    <div className={`sticky z-40`}>
      <div className="relative w-full overflow-hidden">
        {/* фон */}
        <div className="absolute inset-0 transition-opacity duration-700">
          <img
            src={slide.imageSrc}
            alt=""
            className="w-full h-full object-cover opacity-70 pointer-events-none select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/20" />
        </div>

        {/* контент */}
        <div className="relative">
          <div className={`${containerClass} mx-auto px-4 sm:px-6 lg:px-8`}>
            <div className="py-4 sm:py-5 md:py-6">
              <div className="grid grid-cols-12 items-center gap-4">
                {/* Days */}
                <div className="col-span-4 sm:col-span-3 md:col-span-2">
                  <div className="leading-none">
                    <div className="text-red-500 font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight">
                      {days.toLocaleString("en-US")}
                    </div>
                    <div className="text-red-100 text-xs sm:text-sm md:text-base -mt-1">
                      days in detention
                    </div>
                  </div>
                </div>

                {/* Name + text */}
                <div className="col-span-7 sm:col-span-8 md:col-span-9">
                  <div className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold">
                      {slide.name}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg">
                      {slide.text}
                    </p>
                  </div>
                </div>

                {/* Close */}
                <div className="col-span-1 flex justify-end">
                  <button
                    onClick={() => setVisible(false)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/40"
                    title="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* навигация */}
              {slides.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`h-2 w-2 rounded-full ${
                        i === index ? "bg-red-500" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
