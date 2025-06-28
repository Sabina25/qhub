import React from 'react';
import { Calendar, ArrowRight, Tag } from 'lucide-react';

const News = () => {
  const newsItems = [
    {
      title: "New Partnership with European Youth Forum",
      excerpt: "We're excited to announce our collaboration with the European Youth Forum to amplify young voices in European policy-making.",
      image: "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      date: "March 15, 2024",
      category: "Partnership",
      featured: true
    },
    {
      title: "Annual Meeting 2024 Highlights",
      excerpt: "Over 350 participants gathered in Barcelona for an inspiring weekend of networking, workshops, and cultural exchange.",
      image: "https://images.pexels.com/photos/1388919/pexels-photo-1388919.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      date: "March 10, 2024",
      category: "Events"
    },
    {
      title: "Digital Inclusion Project Launch",
      excerpt: "Our new initiative aims to bridge the digital divide in international education and ensure equal access to mobility opportunities.",
      image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      date: "February 28, 2024",
      category: "Projects"
    },
    {
      title: "Green Mobility Report Released",
      excerpt: "Our comprehensive study on sustainable transportation in student mobility offers actionable insights for institutions.",
      image: "https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop",
      date: "February 20, 2024",
      category: "Research"
    }
  ];

  const categories = ["All", "Partnership", "Events", "Projects", "Research", "Policy"];

  return (
    <section id="news" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Latest News
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with our latest initiatives, partnerships, and stories 
            from the Erasmus Generation community
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                category === "All"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Article */}
        {newsItems.filter(item => item.featured).map((item, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-64 lg:h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Tag className="h-4 w-4 mr-2" />
                  {item.category}
                  <span className="mx-2">•</span>
                  <Calendar className="h-4 w-4 mr-2" />
                  {item.date}
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  {item.excerpt}
                </p>
                <button className="flex items-center text-blue-600 hover:text-blue-800 font-semibold text-lg transition-colors duration-200 group">
                  Read Full Story
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.filter(item => !item.featured).map((item, index) => (
            <article key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {item.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  {item.date}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                  {item.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {item.excerpt}
                </p>
                
                <button className="flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 group">
                  Read More
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200">
            View All News
          </button>
        </div>
      </div>
    </section>
  );
};

export default News;