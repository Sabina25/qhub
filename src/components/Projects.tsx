import { useNavigate } from 'react-router-dom';
import { ExternalLink, Calendar, Users } from 'lucide-react';
import { useTranslation } from '../context/TranslationContext';
import projects from '../data/projects.tsx';

interface Project {
  title: string;
  description: string;
  image: string;
  funding: string;
  duration: string;
  participants: string;
}

const Projects = () => {
  const arrProjects = projects.slice(0, 4);
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-raleway font-semibold text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('projects.title')}
          </h2>
          <p className="font-notosans text-xl text-gray-600 max-w-3xl mx-auto">
            {t('projects.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {arrProjects.map((pr: Project, index: number) => (
            <div key={index} className="bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 group">
              <div className="relative overflow-hidden">
                <img
                  src={pr.image}
                  alt={pr.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 text-sm font-semibold">
                    {pr.funding}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{pr.title}</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {pr.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    {pr.participants}
                  </div>
                </div>

                <button className="flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">
                  {t('projects.button_more')}
                  <ExternalLink className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/projects')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-semibold transition"
          >
            {t('projects.button_view_all')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
