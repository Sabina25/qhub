import { ArrowRight, Users } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext'; 

const Hero = () => {
  const { t } = useTranslation(); 

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-800/80 z-10"
        style={{
          backgroundImage: `url('./images/Q1.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90 z-20" />

      {/* Content */}
      <div className="relative z-30 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <div className="flex justify-center mb-6">
            <Users className="h-16 w-16 text-orange-400" />
          </div>

          <h1 className="font-raleway font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight">
            {t('hero.title')}
          </h1>

          <p className="font-notosans text-xl md:text-2xl text-gray-200 mb-6 max-w-3xl mx-auto leading-relaxed">
            {t('hero.description1')}
          </p>

          <p className="font-notosans text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('hero.description2')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className=" h-16 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              {t('hero.button_learn_more')}
              <ArrowRight className="h-5 w-5" />
            </button>
            
            {/* <button onClick={() => {
                console.log('Image button clicked')}}
              className="transition-all duration-300 transform hover:scale-105 focus:outline-none"
            >
              <img
                src="../images/partnersLogo/logo_01.png" 
                alt={t('hero.button_learn_more')}
                className="h-20 w-auto" 
              />
            </button> */}
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105">
              {t('hero.button_media')}
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
