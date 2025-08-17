import { Target, Heart, Globe, Award } from 'lucide-react';
import { useTranslation } from '../../context/TranslationContext';

const Mission = () => {
  const { t } = useTranslation();

  return (
    <section id="organisation" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-raleway font-semibold text-4xl md:text-5xl font-bold text-gray-900 mb-6 ">
            {t('mission.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('mission.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-8">
            {/* Vision */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-raleway text-xl font-semibold text-gray-900 mb-2 uppercase">
                  {t('mission.vision_title')}
                </h3>
                <p className="font-sans  text-gray-600 ">
                  {t('mission.vision_text')}
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Heart className="h-8 w-8 text-orange-500" />
              </div>
              <div>
                <h3 className="font-raleway text-xl font-semibold text-gray-900 mb-2 uppercase">
                  {t('mission.values_title')}
                </h3>
                <p className="font-sans  text-gray-600">
                  {t('mission.values_text')}
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-raleway text-xl font-semibold text-gray-900 mb-2 uppercase">
                  {t('mission.mission_title')}
                </h3>
                <p className="font-sans  text-gray-600">
                  {t('mission.mission_text')}
                </p>
              </div>
            </div>
          </div>

          {/* Image & Badge */}
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
              alt="Diverse group of young Europeans"
              className="rounded-lg shadow-2xl w-full h-96 object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white p-4 rounded-lg shadow-lg">
              <Award className="h-8 w-8 mb-2" />
              <p className=" font-semibold">
                {t('mission.award_label')}
              </p>
              <p className="text-sm opacity-90">
                {t('mission.award_subtext')}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className=" text-3xl font-bold text-blue-600 mb-2">
              {t('mission.stat_1_value')}
            </div>
            <div className="text-gray-600">
              {t('mission.stat_1_label')}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className=" text-3xl font-bold text-orange-500 mb-2">
              {t('mission.stat_2_value')}
            </div>
            <div className="text-gray-600">
              {t('mission.stat_2_label')}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {t('mission.stat_3_value')}
            </div>
            <div className="text-gray-600">
              {t('mission.stat_3_label')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
