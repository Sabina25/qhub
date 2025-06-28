import React from 'react';
import { Calendar, MapPin, Download, Users, Camera } from 'lucide-react';

const AnnualMeeting = () => {
  const pastMeetings = [
    {
      year: "2024",
      location: "Barcelona, Spain",
      theme: "Digital Europe & Youth Mobility",
      image: "https://images.pexels.com/photos/1388919/pexels-photo-1388919.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      participants: 350
    },
    {
      year: "2023",
      location: "Vienna, Austria",
      theme: "Sustainable Futures Together",
      image: "https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      participants: 320
    },
    {
      year: "2022",
      location: "Prague, Czech Republic",
      theme: "Building Bridges in Crisis",
      image: "https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      participants: 280
    }
  ];

  return (
    <section id="annual-meeting" className="py-20 bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Annual Meeting
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our flagship event bringing together Erasmus alumni, students, and partners 
            from across Europe for networking, learning, and celebration
          </p>
        </div>

        {/* Next Meeting */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Next Event
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Annual Meeting 2025
              </h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                  <span>June 14-16, 2025</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                  <span>Lisbon, Portugal</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-3 text-blue-600" />
                  <span>Expected 400+ participants</span>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Join us in beautiful Lisbon for three days of workshops, networking, 
                and inspiring discussions on "Europe's Future: Youth Leading Change".
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                  Register Now
                </button>
                <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Download Program
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1134204/pexels-photo-1134204.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Lisbon cityscape"
                className="rounded-lg w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="text-xl font-semibold">Lisbon, Portugal</h4>
                <p className="text-sm opacity-90">Europe's Future: Youth Leading Change</p>
              </div>
            </div>
          </div>
        </div>

        {/* Past Meetings */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Past Annual Meetings
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {pastMeetings.map((meeting, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img
                    src={meeting.image}
                    alt={`${meeting.location} ${meeting.year}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                    {meeting.year}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {meeting.location}
                  </h4>
                  <p className="text-gray-600 mb-3">{meeting.theme}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Users className="h-4 w-4 mr-2" />
                    {meeting.participants} participants
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center">
                      <Camera className="h-4 w-4 mr-1" />
                      Gallery
                    </button>
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors duration-200 flex items-center justify-center">
                      <Download className="h-4 w-4 mr-1" />
                      Report
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnnualMeeting;