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
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const contentWidth = container.scrollWidth / 2;
    let frameId: number;

    const scroll = () => {
      if (!isHovered.current) {
        container.scrollLeft += 1;

        // Перескок в начало без дёргания
        if (container.scrollLeft >= contentWidth) {
          container.scrollLeft = 0;
        }
      }
      frameId = requestAnimationFrame(scroll);
    };

    frameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div
      className="relative bg-white py-6 overflow-hidden"
      onMouseEnter={() => (isHovered.current = true)}
      onMouseLeave={() => (isHovered.current = false)}
    >
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Кнопки */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md z-10"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md z-10"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Лента логотипов */}
        <div
          ref={scrollRef}
          className="flex gap-10 overflow-x-auto touch-auto px-6 whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollBehavior: "auto" }} // Важно: убрать scroll-smooth!
        >
          {[...logos, ...logos].map((logo, index) => (
            <a
              key={index}
              href={logo.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block flex-shrink-0 transition-transform duration-300 hover:scale-105"
            >
              <img
                src={logo.src}
                alt={`logo-${index}`}
                className="h-12 sm:h-16 md:h-20 w-auto object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoMarquee;
