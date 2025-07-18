import { useEffect, useRef } from 'react';

interface ParallaxBannerProps {
  image: string;
  height?: string;
}

const ParallaxBanner = ({ image, height = '75vh' }: ParallaxBannerProps) => {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (imageRef.current) {
        const scrollY = window.scrollY;
        imageRef.current.style.transform = `translateY(${scrollY * 0.3}px)`; // параллакс-эффект
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative overflow-hidden" style={{ height }}>
      <div
        ref={imageRef}
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url(${image})`,
          willChange: 'transform',
        }}
      ></div>
    </div>
  );
};

export default ParallaxBanner;
