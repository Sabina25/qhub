import { ArrowRight, Users } from 'lucide-react';
import { useTranslation } from '../../context/TranslationContext';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goLearnMore = () => {
    // якорь "about" или твой роут
    const el = document.querySelector('#about');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else navigate('/about');
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/Q1.jpg"
          alt=""
          className="h-full w-full object-cover md:bg-fixed"
          loading="eager"
          fetchPriority="high"
        />
        {/* single overlay for контраст */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/85 via-blue-900/80 to-blue-800/75" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <div className="mb-6 flex justify-center">
            <Users className="h-16 w-16 text-orange-400" aria-hidden="true" />
          </div>

          <h1 className="font-raleway text-white leading-tight mb-6 text-4xl md:text-6xl lg:text-7xl">
            {t('hero.title')}
          </h1>

          <p className="font-sans text-gray-200/95 leading-relaxed mb-4 text-lg md:text-xl max-w-3xl mx-auto">
            {t('hero.description1')}
          </p>
          <p className="font-sans text-gray-200/90 leading-relaxed mb-10 md:mb-12 text-lg md:text-xl max-w-3xl mx-auto">
            {t('hero.description2')}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={goLearnMore}
              className="inline-flex h-14 sm:h-16 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 sm:px-8 text-white font-semibold text-base sm:text-lg transition-all duration-200 hover:bg-orange-600 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-400/40 active:scale-[0.99]"
            >
              {t('hero.button_learn_more')}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>

            <button
              onClick={() => navigate('/media')}
              className="inline-flex h-14 sm:h-16 items-center justify-center rounded-xl border-2 border-white/90 px-6 sm:px-8 font-semibold text-base sm:text-lg text-white transition-all duration-200 hover:bg-white hover:text-blue-900 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 active:scale-[0.99]"
            >
              {t('hero.button_media')}
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <div className="h-10 w-6 rounded-full border-2 border-white/90 flex justify-center">
            <div className="mt-2 h-3 w-1 rounded-full bg-white/90 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
