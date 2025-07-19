import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';
import events from './data/events.tsx';

interface Event {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  featured?: boolean;
}

const SKELETON_COUNT = 6;

const SkeletonCard = () => (
  <div className="animate-pulse bg-gray-100 p-4 rounded-xl h-64">
    <div className="w-full h-32 bg-gray-300 rounded mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

const AllEventsPage: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const loadMore = () => {
    if (visibleCount >= events.length || isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 6);
      setIsLoading(false);
    }, 800); // Имитация загрузки
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [visibleCount, isLoading]);

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold mb-10 text-center">All Events</h1>
        <hr className="mb-10 border-t border-gray-300" />
        <div className="grid md:grid-cols-3 gap-8">
          {events.slice(0, visibleCount).map((event: Event) => (
            <Link
              to={`/events/${event.id}`}
              key={event.id}
              className="relative block transform transition-transform duration-300 hover:scale-105"
            >
              {event.featured && (
                <span className="absolute top-2 right-2 bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded">
                  Featured
                </span>
              )}
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h2 className="font-raleway text-2xl mb-2">{event.title}</h2>
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Date: {event.date}</p>
              </div>
            </Link>
          ))}
          {isLoading &&
            Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} />
            ))}
        </div>
        <div ref={loaderRef} className="h-10 mt-10" />
      </main>
      <Footer />
    </>
  );
};

export default AllEventsPage;
