import { Target, Heart, Globe, Award } from 'lucide-react';
import { useTranslation } from '../../context/TranslationContext';

const Mission = () => {
  const { t } = useTranslation();

  return (
    <section id="organisation" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="font-raleway font-semibold text-4xl md:text-5xl text-gray-900 mb-6">
            {t('mission.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('mission.subtitle')}
          </p>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: bullets */}
          <div className="space-y-8">
            {/* Vision */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {/* Brand dark */}
                <Target className="h-8 w-8 text-[#1A3639]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-raleway text-xl font-semibold text-gray-900 mb-2 uppercase">
                  {t('mission.vision_title')}
                </h3>
                <p className="font-sans text-gray-600">
                  {t('mission.vision_text')}
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {/* Keep contrast accent */}
                <Heart className="h-8 w-8 text-orange-500" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-raleway text-xl font-semibold text-gray-900 mb-2 uppercase">
                  {t('mission.values_title')}
                </h3>
                <p className="font-sans text-gray-600">
                  {t('mission.values_text')}
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {/* Brand teal */}
                <Globe className="h-8 w-8 text-[#319795]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-raleway text-xl font-semibold text-gray-900 mb-2 uppercase">
                  {t('mission.mission_title')}
                </h3>
                <p className="font-sans text-gray-600">
                  {t('mission.mission_text')}
                </p>
              </div>
            </div>
          </div>

          {/* Right: image + badge */}
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
              alt="Diverse group of young Europeans"
              className="rounded-lg shadow-2xl w-full h-96 object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-[#f97316] text-white p-4 rounded-lg shadow-lg">
              {/* Award icon in light aqua */}
              <Award className="h-8 w-8 mb-2 text-[#4FD1C5]" aria-hidden="true" />
              <p className="font-semibold">{t('mission.award_label')}</p>
              <p className="text-sm opacity-90">{t('mission.award_subtext')}</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-[#1A3639] mb-2">
              {t('mission.stat_1_value')}
            </div>
            <div className="text-gray-600">{t('mission.stat_1_label')}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-[#319795] mb-2">
              {t('mission.stat_2_value')}
            </div>
            <div className="text-gray-600">{t('mission.stat_2_label')}</div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-[#4FD1C5] mb-2">
              {t('mission.stat_3_value')}
            </div>
            <div className="text-gray-600">{t('mission.stat_3_label')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
