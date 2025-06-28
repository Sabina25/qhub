import React from 'react';
import { ExternalLink, Calendar, MapPin, Users } from 'lucide-react';

const Projects = () => {
  const projects = [
    {
      title: "EuroVoices",
      description: "Amplifying young European voices in policy-making through digital platforms and civic engagement initiatives.",
      image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      funding: "Erasmus+ Programme",
      duration: "2023-2025",
      participants: "15 countries"
    },
    {
      title: "Bridge Building",
      description: "Creating connections between Erasmus alumni and current students to foster mentorship and professional networks.",
      image: "https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      funding: "European Commission",
      duration: "2024-2026",
      participants: "25 cities"
    },
    {
      title: "Green Mobility",
      description: "Promoting sustainable practices in international education and green transportation for student mobility.",
      image: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      funding: "EU Green Deal",
      duration: "2023-2024",
      participants: "12 countries"
    },
    {
      title: "Digital Inclusion",
      description: "Ensuring equal access to digital education and mobility opportunities for students from all backgrounds.",
      image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      funding: "Digital Europe Programme",
      duration: "2024-2025",
      participants: "20 universities"
    }
  ];

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
          {projects.map((project, index) => (
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
                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                
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
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
            View All Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default Projects;