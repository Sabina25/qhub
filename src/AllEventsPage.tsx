import React from 'react';
import Footer from './components/Footer';
import Header from './components/Header';
import events from './data/events';

interface Event {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  featured?: boolean;
}

const AllEventsPage: React.FC = () => {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-10 text-center">All Events</h1>
        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event: Event, index: number) => (
            <div key={index} className="bg-white rounded-xl shadow p-6">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
              <p className="text-gray-700 mb-3">{event.excerpt}</p>
              <p className="text-sm text-gray-500">Date: {event.date}</p>
              <p className="text-sm text-gray-500">Category: {event.category}</p>
              {event.featured && (
                <p className="text-sm text-green-600 font-semibold">Featured</p>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AllEventsPage;
