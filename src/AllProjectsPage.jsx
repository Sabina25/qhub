import React from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import projects from './data/projects'; 

const AllProjectsPage = () => {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-10 text-center">All Projects</h1>
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-white rounded-xl shadow p-6">
              <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded mb-4" />
              <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
              <p className="text-gray-700 mb-3">{project.description}</p>
              <p className="text-sm text-gray-500">Funding: {project.funding}</p>
              <p className="text-sm text-gray-500">Duration: {project.duration}</p>
              <p className="text-sm text-gray-500">Participants: {project.participants}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AllProjectsPage;
