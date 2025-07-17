import { useParams, Link } from 'react-router-dom';
import events from './data/events.tsx';

import Footer from './components/Footer';
import Header from './components/Header';

const EventDetailPage = () => {
  const { id } = useParams();
  const selectedEvent = events[Number(id)];

  if (!selectedEvent || typeof selectedEvent.image !== 'string') {
    console.warn('Invalid event or image:', selectedEvent);
    return <p className="text-center mt-20">Event not found or error</p>;
  }

  return (
    <>
        <Header />
        <div
            className="w-full h-[75vh] bg-center bg-cover bg-fixed"
            style={{ backgroundImage: `url(${selectedEvent.image})` }}
        ></div>
        <div className="max-w-4xl mx-auto px-4 py-10">
            <Link to="/events" className="text-blue-600 underline mb-4 inline-block">← Back to Events</Link>
            <h1 className="text-4xl mb-4">{selectedEvent.title}</h1>
            <p className="text-gray-500 text-sm mb-2">Date: {selectedEvent.date}</p>
            <div
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: selectedEvent.excerpt }}
            ></div>
        </div>
        <Footer />
    </>
  );
};

export default EventDetailPage;
