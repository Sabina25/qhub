import React from 'react';
import { MapPin, Users, ExternalLink, Mail } from 'lucide-react';

const GE4Cities = () => {
  const cities = [
    {
      name: "Berlin",
      country: "Germany",
      coordinator: "Anna Schmidt",
      organization: "Berlin Erasmus Network",
      members: 450,
      image: "https://images.pexels.com/photos/109630/pexels-photo-109630.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    },
    {
      name: "Barcelona",
      country: "Spain",
      coordinator: "Carlos Rodriguez",
      organization: "Erasmus Barcelona",
      members: 380,
      image: "https://images.pexels.com/photos/1388919/pexels-photo-1388919.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    },
    {
      name: "Vienna",
      country: "Austria",
      coordinator: "Maria Müller",
      organization: "Vienna International Students",
      members: 290,
      image: "https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    },
    {
      name: "Amsterdam",
      country: "Netherlands",
      coordinator: "Pieter Van der Berg",
      organization: "Amsterdam Student Network",
      members: 340,
      image: "https://images.pexels.com/photos/1878293/pexels-photo-1878293.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    },
    {
      name: "Prague",
      country: "Czech Republic",
      coordinator: "Eva Novakova",
      organization: "Prague Mobility Hub",
      members: 320,
      image: "https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    },
    {
      name: "Lisbon",
      country: "Portugal",
      coordinator: "João Silva",
      organization: "Lisbon Erasmus Community",
      members: 280,
      image: "https://images.pexels.com/photos/1134204/pexels-photo-1134204.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
    }
  ];

  return (
    <section id="ge4cities" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            gE4Cities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Local chapters across Europe connecting Erasmus alumni and students 
            in vibrant city networks that foster ongoing collaboration and friendship
          </p>
        </div>

        {/* Interactive Map Placeholder */}
        <div className="bg-gradient-to-br from-blue-100 to-orange-100 rounded-2xl p-8 mb-12">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              35+ Cities Across Europe
            </h3>
            <p className="text-gray-600 mb-6">
              From Reykjavik to Athens, our network spans the continent
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
              Explore Interactive Map
            </button>
          </div>
        </div>

        {/* City Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cities.map((city, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
              <div className="relative overflow-hidden">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{city.name}</h3>
                  <p className="text-sm opacity-90">{city.country}</p>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {city.members}
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Local Coordinator</h4>
                  <p className="text-gray-600">{city.coordinator}</p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-1">Partner Organization</h4>
                  <p className="text-gray-600 text-sm">{city.organization}</p>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Visit
                  </button>
                  <button className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center">
                    <Mail className="h-4 w-4 mr-1" />
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">
            Don't see your city?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Help us expand our network by starting a new gE4Cities chapter in your area
          </p>
          <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
            Start a New Chapter
          </button>
        </div>
      </div>
    </section>
  );
};

export default GE4Cities;