import { useEffect, useRef } from "react";

  const logos = [
    { src: "../images/partnersLogo/logo_01.png", link: "https://www.youtube.com/@crimea_vox" },
    { src: "../images/partnersLogo/Logo_3@4x.png", link: "https://www.dumk.org/" },
    { src: "../images/partnersLogo/logo_text_white.jpg", link: "https://example.com/3" },
    { src: "../images/partnersLogo/logo_takava_page-0001.jpg", link: "https://www.instagram.com/takava_coffeebuffet/" },
    { src: "../images/partnersLogo/CD.png", link: "https://www.facebook.com/CrimeaDaily/" },
    { src: "../images/partnersLogo/kf.jpg", link: "https://example.com/6" },
    { src: "../images/partnersLogo/kd.jpg", link: "https://crimeanhouse.org/" },
    { src: "../images/partnersLogo/f.jpg", link: "https://example.com/9" },
    { src: "../images/partnersLogo/m.jpg", link: "https://qtmm.org/" },
  ];
  
  const LogoMarquee = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const isHovered = useRef(false);
  
    useEffect(() => {
      const container = scrollRef.current;
      if (!container) return;
  
      let frameId: number;
  
      const scroll = () => {
        if (!isHovered.current) {
          if (container.scrollLeft >= container.scrollWidth / 2) {
            container.scrollLeft = 0;
          } else {
            container.scrollLeft += 1;
          }
        }
        frameId = requestAnimationFrame(scroll);
      };
  
      frameId = requestAnimationFrame(scroll);
      return () => cancelAnimationFrame(frameId);
    }, []);
  
    return (
      <div
        className="relative bg-white py-6 overflow-hidden"
        onMouseEnter={() => (isHovered.current = true)}
        onMouseLeave={() => (isHovered.current = false)}
      >
  
        {/* Лента */}
        <div
          ref={scrollRef}
          className="flex gap-10 overflow-x-auto scroll-smooth touch-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {logos.concat(logos).map((logo, index) => (
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
    );
  };
  
  export default LogoMarquee;
  
  

