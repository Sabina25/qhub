import {useState} from 'react';
import { Users, CaseSensitive as University, Building, Heart } from 'lucide-react';
import memberLogos from '../data/members'

const Members = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleLogos = showAll ? memberLogos : memberLogos.slice(0, 8);

  const stats = [
    { number: "150+", label: "Partner Organizations", icon: Building },
    { number: "500+", label: "Universities", icon: University },
    { number: "12M+", label: "Alumni Network", icon: Users },
    { number: "35", label: "Countries", icon: Heart }
  ];

  return (
    <section id="members" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Members & Partners
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Building a stronger Europe together with leading universities, organizations, 
            and institutions committed to educational mobility and youth empowerment
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
      <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
        Trusted by Leading Organizations
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {visibleLogos.map((member, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-center min-h-[120px] group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-xl">
                  {member.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-700 line-clamp-2">
                {member.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">{member.type}</p>
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
            {showAll ? "See less" : "See more"}
          </button>
        </div>
      )}
    </div>

        {/* Join Us Section */}
        {/* <div className="bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl p-8 text-white text-center">
          <Users className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h3 className="text-3xl font-bold mb-4">
            Join Our Growing Network
          </h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Become part of Europe's largest professional network of Erasmus alumni and 
            contribute to shaping the future of international education and mobility.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
              Become a Member
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all duration-200">
              Partner with Us
            </button>
          </div>
        </div> */}

        {/* Membership Benefits 
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Membership Benefits
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Networking</h4>
              <p className="text-gray-600">
                Connect with thousands of Erasmus alumni across Europe and build 
                meaningful professional relationships.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <University className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Professional Development</h4>
              <p className="text-gray-600">
                Access exclusive workshops, training programs, and career 
                development opportunities.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Community Impact</h4>
              <p className="text-gray-600">
                Contribute to projects that promote European integration and 
                support the next generation of mobile students.
              </p>
            </div>
          </div>
        </div>
        */}
      </div>
    </section>
  );
};

export default Members;