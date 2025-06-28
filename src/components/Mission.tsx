import React from 'react';
import { Target, Heart, Globe, Award } from 'lucide-react';

const Mission = () => {
  return (
    <section id="organisation" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Mission & Vision
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Building bridges across Europe through the shared experience of educational mobility
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Mission</h3>
                <p className="text-gray-600">
                  To connect, support, and empower the Erasmus Generation - young Europeans who have 
                  experienced international mobility and are committed to building a more united, 
                  inclusive, and dynamic Europe.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Heart className="h-8 w-8 text-orange-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Values</h3>
                <p className="text-gray-600">
                  Diversity, solidarity, and European citizenship guide everything we do. 
                  We believe in the transformative power of cross-cultural exchange and 
                  lifelong learning.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Vision</h3>
                <p className="text-gray-600">
                  A Europe where mobility is accessible to all, where cultural diversity is 
                  celebrated, and where the Erasmus Generation leads positive social change.
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
              alt="Diverse group of young Europeans"
              className="rounded-lg shadow-2xl w-full h-96 object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white p-4 rounded-lg shadow-lg">
              <Award className="h-8 w-8 mb-2" />
              <p className="font-semibold">35+ Countries</p>
              <p className="text-sm opacity-90">United in diversity</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-blue-600 mb-2">12M+</div>
            <div className="text-gray-600">Erasmus Alumni</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-orange-500 mb-2">4000+</div>
            <div className="text-gray-600">Universities</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-blue-600 mb-2">35</div>
            <div className="text-gray-600">Countries</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-orange-500 mb-2">35+</div>
            <div className="text-gray-600">Years of Impact</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;