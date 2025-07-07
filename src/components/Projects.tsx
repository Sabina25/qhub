import { useNavigate } from 'react-router-dom';
import { ExternalLink, Calendar, Users } from 'lucide-react';
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

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Projects
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Innovative initiatives driving change through collaboration, education, and civic engagement.
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {arrProjects.map((project: Project, index: number) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden border border-gray-100"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 bg-blue-600 text-white text-sm px-3 py-1 rounded-full shadow-md font-medium">
                  {project.funding}
                </span>
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {project.title}
                </h3>
                {/* <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p> */}

                <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {project.duration}
                  </span>
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {project.participants}
                  </span>
                </div>

                <button className="mt-auto inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                  More Info
                  <ExternalLink className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/projects')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200"
          >
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
