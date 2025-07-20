import { useState } from 'react';
import memberLogos from '../data/members';
import LogoMarquee from './LogoMarquee';
import { useTranslation } from '../context/TranslationContext';

const Members = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleLogos = showAll ? memberLogos : memberLogos.slice(0, 5);
  const { t } = useTranslation();

  return (
    <section id="members" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-raleway font-semibold text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('members.title')}
          </h2>
          <p className="font-notosans text-xl text-gray-600 max-w-3xl mx-auto">
            {t('members.subtitle')}
          </p>
        </div>

        <LogoMarquee />

        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h3 className="font-raleway font-semibold text-2xl font-bold text-gray-900 text-center mb-8">
            {t('members.team')}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {visibleLogos.map((member, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-sm shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-center min-h-[85px] group"
              >
                <div className="text-center">
                  {member.imageUrl ? (
                    <div className="w-32 h-32 rounded-sm overflow-hidden mx-auto mb-3 group-hover:scale-105 transition-transform duration-200">
                      <img
                        src={member.imageUrl}
                        alt={t(member.name)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-blue-500 to-orange-500 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-200">
                      <span className="text-white font-bold text-xl">
                        {t(member.name).split(" ").map((word) => word[0]).join("").slice(0, 2)}
                      </span>
                    </div>
                  )}

                  <p className="text-sm font-medium text-gray-700 line-clamp-2">
                    {t(member.name)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{t(member.role)}</p>
                </div>
              </div>
            ))}
          </div>

          {memberLogos.length > 8 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-blue-600 font-medium hover:underline"
              >
                {showAll ? t('members.show_less') : t('members.show_more')}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Members;
