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
  const arrProjects = projects.slice(0, 4)
  const navigate = useNavigate();

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Innovative initiatives driving positive change across Europe through collaboration, 
            education, and civic engagement
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {arrProjects.map((project: Project, index: number) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {project.funding}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
                {/* <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p> */}
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {project.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="h-4 w-4 mr-2" />
                    {project.participants}
                  </div>
                </div>
                
                <button className="flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">
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
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
      >
        View All Projects
      </button>
        </div>
      </div>
    </section>
  );
};

export default Projects;