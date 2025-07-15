import React , {useState} from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import events from './data/events.tsx';

interface Event {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  featured?: boolean;
}

const AllEventsPage: React.FC = () => {
    const [visibleCount, setVisibleCount] = useState(6);

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 6);
  };

  const hasMore = visibleCount < events.length;
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-10 text-center">All Events</h1>
        <div className="grid md:grid-cols-3 gap-8">
          {events.slice(0, visibleCount).map((event: Event, index: number) => (
            <div key={index} className=" transform transition-transform duration-300 hover:scale-105">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover mb-4"
              />
              <h2 className="font-raleway text-2xl  mb-2">{event.title}</h2>
              {/* <p className="text-gray-700 mb-3">{event.excerpt}</p> */}
              <p className="text-sm text-gray-500">Date: {event.date}</p>
              <p className="text-sm text-gray-500">Category: {event.category}</p>
              {event.featured && (
                <p className="text-sm text-green-600 font-semibold">Featured</p>
              )}
            </div>
          ))}
        </div>

        {hasMore && (
          <div className="text-center mt-10">
            <button
              onClick={handleLoadMore}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              More
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default AllEventsPage;
