import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import events from '../data/events';

const News = () => {
  const navigate = useNavigate();

  interface Event {
    title: string;
    excerpt: string;
    image: string;
    date: string;
    category: string;
    featured?: boolean;
  }
 

  //const categories = ["All", "Partnership", "Events", "Projects", "Research", "Policy"];

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

        {/* Category Filter
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
        </div> */}

        {/* Featured Article */}
        {events.filter((item: Event) => item.featured).map((item:Event , index: number) => (
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
          {events.filter(item => !item.featured).map((item, index) => (
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
          <button 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
          onClick={() => navigate('/events')}>
            View All News
          </button>
        </div>
      </div>
    </section>
  );
};

export default News;