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

const DESK_TRACK_H = 88; // px — высота полосы на десктопе
const MOB_TRACK_H  = 72; // px — высота полосы на мобайле

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
    const track = deskTrackRef.current;
    if (!track) return;

    const baseSpeed = 0.7; // px/frame
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

  // подталкивание по кнопкам (десктоп)
  const nudge = (delta: number) => {
    const track = deskTrackRef.current;
    if (!track) return;
    const cur = parseFloat((/translateX\((-?\d+(\.\d+)?)px\)/.exec(track.style.transform) || [,'0'])[1]);
    track.style.transform = `translateX(${cur + delta}px)`;
  };

  // -------- Mobile: “живая” волна --------
  useEffect(() => {
    const track = mobTrackRef.current;
    if (!track) return;

    let x = 0;
    let halfWidth = 0;
    let raf = 0;

    const base = 0.6;
    const breathAmp = 0.25; // модуляция скорости
    const waveAmpY = 6;     // px по Y (влезает в высоту дорожки)
    const waveAmpS = 0.08;  // масштаб
    const waveLen = 220;    // длина волны в px

    const measure = () => {
      const children = Array.from(track.children) as HTMLElement[];
      const half = Math.ceil(children.length / 2);
      halfWidth = children.slice(0, half).reduce((w, el) => w + el.offsetWidth, 0);
    };

    const step = (t: number) => {
      if (!isHovered.current) {
        const v = base + breathAmp * Math.sin(t * 0.0015);
        x -= v;
        if (x <= -halfWidth) x += halfWidth;
        track.style.transform = `translateX(${x}px)`;

        const children = Array.from(track.children) as HTMLElement[];
        let acc = x;
        for (const cell of children) {
          const w = cell.offsetWidth;
          acc += w / 2;
          const phase = (acc % waveLen) / waveLen; // 0..1
          const y = Math.sin(phase * Math.PI * 2) * waveAmpY;
          const s = 1 + Math.cos(phase * Math.PI * 2) * waveAmpS;
          // трансформируем именно содержимое (img), а не контейнер-ячейку
          const img = cell.querySelector("img") as HTMLElement | null;
          if (img) img.style.transform = `translateY(${y}px) scale(${s})`;
          acc += w / 2 + 32; // gap-8 (8*4)
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
      Array.from(track.querySelectorAll("img")).forEach((img) => (img as HTMLElement).style.transform = "");
    };
  }, []);

  return (
    <div
      className="relative bg-white py-8 overflow-visible"
      onMouseEnter={() => (isHovered.current = true)}
      onMouseLeave={() => (isHovered.current = false)}
    >
      {/* ---------- DESKTOP (>= md) ---------- */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 relative">
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
          {/* мягкая маска по краям и увеличенная высота дорожки */}
          <div
            className="relative"
            style={{
              height: DESK_TRACK_H + 16, // +внутренние отступы снизу/сверху
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 7%, black 93%, transparent)",
              maskImage:
                "linear-gradient(to right, transparent, black 7%, black 93%, transparent)",
            }}
          >
            <div
              ref={deskTrackRef}
              className="flex gap-10 items-center will-change-transform py-2"
              style={{ height: DESK_TRACK_H }}
            >
              {[...logos, ...logos].map((logo, i) => (
                <a
                  key={`d-${i}`}
                  href={logo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center flex-shrink-0"
                  style={{ height: DESK_TRACK_H }}
                >
                  <img
                    src={logo.src}
                    alt={`logo-${i}`}
                    className="max-h-full w-auto object-contain"
                  />
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
            height: MOB_TRACK_H + 18,
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <div
            ref={mobTrackRef}
            className="flex items-center gap-8 will-change-transform py-3"
            style={{ height: MOB_TRACK_H }}
          >
            {[...logos, ...logos].map((logo, i) => (
              <a
                key={`m-${i}`}
                href={logo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center flex-shrink-0"
                style={{ height: MOB_TRACK_H }}
              >
                <img
                  src={logo.src}
                  alt={`logo-${i}`}
                  className="max-h-full w-auto object-contain transition-transform duration-300"
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
