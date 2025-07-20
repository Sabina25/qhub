import React from 'react';
import { useTranslation } from '../context/TranslationContext';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import projects from '../data/projects.tsx';

interface Project {
  title: string;
  description: string;
  image: string;
  funding: string;
  duration: string;
  participants: string;
}

const Projects: React.FC = () => {
  const { t } = useTranslation();

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    created(slider) {
      setInterval(() => {
        slider.next();
      }, 6000); // Автопрокрутка каждые 6 сек
    },
  });

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-raleway font-semibold text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('projects.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-notosans">
            {t('projects.subtitle')}
          </p>
        </div>

        <div className="relative">
          <div ref={sliderRef} className="keen-slider">
            {projects.slice(0, 5).map((pr: Project, index: number) => (
              <div key={index} className="keen-slider__slide">
                <div className="flex flex-col lg:flex-row bg-gray-50 rounded-lg shadow-md overflow-hidden min-h-[400px]">
                  {/* Левая часть: Картинка */}
                  <div className="lg:w-1/2 w-full h-80 lg:h-auto">
                    <img
                      src={pr.image}
                      alt={pr.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Правая часть: Контент */}
                  <div className="lg:w-1/2 w-full p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="font-raleway uppercase text-3xl text-gray-800 mb-4">{pr.title}</h3>
                      <div className="text-sm text-blue-600 font-semibold mb-3">
                        {pr.funding} • {pr.duration} • {pr.participants}
                      </div>
                      <p className="text-gray-700 text-base leading-relaxed font-notosans">{pr.description}</p>
                    </div>
                    <button className="mt-6 text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2">
                      {t('projects.button_more')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Стрелки */}
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute top-1/2 left-0 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:scale-105 transition z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute top-1/2 right-0 -translate-y-1/2 bg-white p-2 rounded-full shadow hover:scale-105 transition z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
