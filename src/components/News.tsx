import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import events from '../data/events.tsx';

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

  return (
    <section id="news" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="font-raleway font-semibold text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Останні новини 
          </h2>
          <p className="font-notosans text-lg text-gray-600 max-w-2xl mx-auto">
            Слідкуйте останніми подіями та історіями нашої спільноти.
          </p>
        </div>

        {/* Featured Article */}
        {events.filter((item: Event) => item.featured).map((item, index) => (
          <div key={index} className="bg-white overflow-hidden mb-12">
            <div className="grid lg:grid-cols-2">
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-72 lg:h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80"></div>
                <span className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-md">
                  Featured
                </span>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Tag className="h-4 w-4 mr-2" />
                  {item.category}
                  <span className="mx-2">•</span>
                  <Calendar className="h-4 w-4 mr-2" />
                  {item.date}
                </div>
                <h3 className="font-anton text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed line-clamp-4">
                  {item.excerpt}
                </p>
                <button className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-lg transition group">
                  Read Full Story
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.filter((item: Event) => !item.featured).map((item, index) => (
            <article
              key={index}
              className="bg-white   overflow-hidden  transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md">
                  {item.category}
                </span>
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  {item.date}
                </div>
                <h3 className="font-anton text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {item.title}
                </h3>
                {/* <p className="mt-4 text-gray-600 text-sm mb-4 line-clamp-3">
                  {item.excerpt}
                </p> */}
                <button className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition group text-sm">
                  Read More
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/events')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md transition"
          >
            Переглянути всі новини
          </button>
        </div>
      </div>
    </section>
  );
};

export default News;
