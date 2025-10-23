import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const logos = [
  { src: "/images/partnersLogo/logo_01.png", link: "https://www.youtube.com/@crimea_vox" },
  { src: "/images/partnersLogo/Logo_3@4x.png", link: "https://www.dumk.org/" },
  { src: "/images/partnersLogo/logo_text_white.jpg", link: "https://amu.org.ua/" },
  { src: "/images/partnersLogo/logo_takava_page-0001.jpg", link: "https://www.instagram.com/takava_coffeebuffet/" },
  { src: "/images/partnersLogo/CD.png", link: "https://www.instagram.com/crimeadaily/" },
  { src: "/images/partnersLogo/kf.jpg", link: "https://crimeanfront.org/" },
  { src: "/images/partnersLogo/kd.jpg", link: "https://crimeanhouse.org/" },
  { src: "/images/partnersLogo/f.jpg", link: "https://www.instagram.com/qirim.young/" },
  { src: "/images/partnersLogo/m.jpg", link: "https://qtmm.org/" },
  { src: "/images/partnersLogo/icon-tamga.png", link: "https://qmvf.org/" },
  { src: "/images/partnersLogo/qd.jpg", link: "https://www.instagram.com/qadindivani/" },
];

const LogoMarquee = () => {
  // desktop
  const deskViewportRef = useRef<HTMLDivElement>(null);
  const deskTrackRef = useRef<HTMLDivElement>(null);

  // mobile
  const mobViewportRef = useRef<HTMLDivElement>(null);
  const mobTrackRef = useRef<HTMLDivElement>(null);

  const isHovered = useRef(false);

  // -------- Desktop: бесконечный translateX --------
  useEffect(() => {
    const viewport = deskViewportRef.current;
    const track = deskTrackRef.current;
    if (!viewport || !track) return;

    const baseSpeed = 0.7; // px per frame
    let x = 0;
    let halfWidth = 0;
    let raf = 0;

    const measure = () => {
      const children = Array.from(track.children) as HTMLElement[];
      const half = Math.ceil(children.length / 2);
      halfWidth = children.slice(0, half).reduce((w, el) => w + el.offsetWidth, 0);
    };

    const step = () => {
      if (!isHovered.current) {
        x -= baseSpeed;
        if (x <= -halfWidth) x += halfWidth;
        track.style.transform = `translateX(${x}px)`;
      }
      raf = requestAnimationFrame(step);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  // Подтолкнуть ленту кнопками (десктоп)
  const nudge = (delta: number) => {
    const track = deskTrackRef.current;
    if (!track) return;
    const cur = parseFloat((/translateX\((-?\d+(\.\d+)?)px\)/.exec(track.style.transform) || [,'0'])[1]);
    track.style.transform = `translateX(${cur + delta}px)`;
  };

  // -------- Mobile: “живая” волна --------
  useEffect(() => {
    const viewport = mobViewportRef.current;
    const track = mobTrackRef.current;
    if (!viewport || !track) return;

    let x = 0;
    let halfWidth = 0;
    let raf = 0;

    // базовая скорость + лёгкое дыхание (меняется от времени)
    const base = 0.6;
    const breathAmp = 0.25; // добавка к скорости
    const waveAmpY = 6;     // px по Y
    const waveAmpS = 0.08;  // масштаб
    const waveLen = 200;    // длина волны в px

    const measure = () => {
      const children = Array.from(track.children) as HTMLElement[];
      const half = Math.ceil(children.length / 2);
      halfWidth = children.slice(0, half).reduce((w, el) => w + el.offsetWidth, 0);
    };

    const step = (t: number) => {
      if (!isHovered.current) {
        // лёгкая модуляция скорости
        const v = base + breathAmp * Math.sin(t * 0.0015);
        x -= v;
        if (x <= -halfWidth) x += halfWidth;
        track.style.transform = `translateX(${x}px)`;

        // волна по элементам: сдвиг и масштаб зависят от их текущего положения
        const children = Array.from(track.children) as HTMLElement[];
        let acc = x;
        for (const el of children) {
          const w = (el as HTMLElement).offsetWidth;
          // позиция центра элемента в треке
          acc += w / 2;
          const phase = (acc % waveLen) / waveLen; // 0..1
          const y = Math.sin(phase * Math.PI * 2) * waveAmpY;
          const s = 1 + Math.cos(phase * Math.PI * 2) * waveAmpS;
          (el as HTMLElement).style.transform = `translateY(${y}px) scale(${s})`;
          acc += w / 2 + 32; // +gap (8 * 4)
        }
      }
      raf = requestAnimationFrame(step);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      // очистим inline-стили на детях
      Array.from(track.children).forEach((c) => ((c as HTMLElement).style.transform = ""));
    };
  }, []);

  return (
    <div
      className="relative bg-white py-8 overflow-hidden"
      onMouseEnter={() => (isHovered.current = true)}
      onMouseLeave={() => (isHovered.current = false)}
    >
      {/* ---------- DESKTOP (>= md): классическая плавная лента ---------- */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 relative">
        {/* кнопки — не обязательны, но приятны */}
        <button
          onClick={() => nudge(200)}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md z-10"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => nudge(-200)}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md z-10"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div ref={deskViewportRef} className="overflow-hidden">
          {/* градиентная маска по краям */}
          <div
            className="relative"
            style={{
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
              maskImage:
                "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
            }}
          >
            <div ref={deskTrackRef} className="flex gap-10 items-center will-change-transform">
              {[...logos, ...logos].map((logo, i) => (
                <a
                  key={`d-${i}`}
                  href={logo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block flex-shrink-0 transition-transform duration-300 hover:scale-105"
                >
                  <img src={logo.src} alt={`logo-${i}`} className="h-16 w-auto object-contain" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- MOBILE (< md): одна “живая” лента с волной ---------- */}
      <div className="block md:hidden px-4">
        <div
          ref={mobViewportRef}
          className="overflow-hidden rounded-xl"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div
            ref={mobTrackRef}
            className="flex items-center gap-8 will-change-transform"
          >
            {[...logos, ...logos].map((logo, i) => (
              <a
                key={`m-${i}`}
                href={logo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block flex-shrink-0"
              >
                <img
                  src={logo.src}
                  alt={`logo-${i}`}
                  className="h-12 w-auto object-contain"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoMarquee;
