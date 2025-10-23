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
  // --- desktop track ---
  const deskViewportRef = useRef<HTMLDivElement>(null);
  const deskTrackRef = useRef<HTMLDivElement>(null);

  // --- mobile rows ---
  const rowRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  const isHovered = useRef(false);

  useEffect(() => {
    const viewport = deskViewportRef.current;
    const track = deskTrackRef.current;
    if (!viewport || !track) return;

   
    const speed = 0.7; 
    let x = 0;
    let halfWidth = 0;
    let raf = 0;

    const measure = () => {
      const children = track.children;
      let firstHalf = 0;
      const halfCount = Math.ceil(children.length / 2);
      for (let i = 0; i < halfCount; i++) {
        firstHalf += (children[i] as HTMLElement).offsetWidth;
      }
      halfWidth = firstHalf || track.scrollWidth / 2;
    };

    const step = () => {
      if (!isHovered.current) {
        x -= speed;
        if (x <= -halfWidth) x += halfWidth; 
        track.style.transform = `translateX(${x}px)`;
      }
      raf = requestAnimationFrame(step);
    };

    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(track);

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

 
  const nudge = (delta: number) => {
    const track = deskTrackRef.current;
    if (!track) return;
   
    const m = /translateX\((-?\d+(\.\d+)?)px\)/.exec(track.style.transform || "");
    const cur = m ? parseFloat(m[1]) : 0;
    const next = cur + delta;
    track.style.transform = `translateX(${next}px)`;
  };

  
  useEffect(() => {
    const speeds = [0.6, -0.85, 0.75]; 
    const frameIds: number[] = [];

    const animateRow = (ref: React.RefObject<HTMLDivElement>, speed: number) => {
      const el = ref.current;
      if (!el) return;
      const width = el.scrollWidth / 2;

      const scroll = () => {
        if (!isHovered.current) {
          el.scrollLeft += speed;
          if (speed > 0 && el.scrollLeft >= width) el.scrollLeft = 0;
          if (speed < 0 && el.scrollLeft <= 0) el.scrollLeft = width;
        }
        const id = requestAnimationFrame(scroll);
        frameIds.push(id);
      };
      scroll();
    };

    rowRefs.forEach((ref, i) => animateRow(ref, speeds[i]));
    return () => frameIds.forEach(cancelAnimationFrame);
  }, []);

  return (
    <div
      className="relative bg-white py-6 overflow-hidden"
      onMouseEnter={() => (isHovered.current = true)}
      onMouseLeave={() => (isHovered.current = false)}
    >
      {/* --- DESKTOP: бесконечная лента --- */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 relative">
        {/* кнопки подталкивания */}
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

        {/* viewport-маска и бегущий трек */}
        <div ref={deskViewportRef} className="overflow-hidden">
          <div
            ref={deskTrackRef}
            className="flex gap-10 items-center will-change-transform"
            
          >
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

      {/* --- MOBILE: три движущиеся строки --- */}
      <div className="block md:hidden space-y-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            ref={rowRefs[i]}
            className="flex gap-8 overflow-hidden whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {[...logos, ...logos].map((logo, index) => (
              <a
                key={`${i}-${index}`}
                href={logo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block flex-shrink-0 transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={logo.src}
                  alt={`logo-${index}`}
                  className={`h-12 w-auto object-contain ${
                    i === 1 ? "opacity-90" : i === 2 ? "opacity-80" : ""
                  }`}
                />
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoMarquee;
