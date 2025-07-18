import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TranslationProvider } from './context/TranslationContext'

import Header from './components/Header';
import Hero from './components/Hero';
import Mission from './components/Mission';
import Projects from './components/Projects';
import News from './components/News';
import Members from './components/Members';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AllEventsPage from './AllEventsPage';
import AllProjectsPage from './AllProjectsPage';
import WaveDivider from './components/WaveDivider';
import EventDetailPage from './EventDetailPage';
import OurMedia from './OurMedia';


import ScrollToTop from './ScrollToTop';

const Home = () => (
  <>
    <Header />
    <main>
      <Hero />
      <WaveDivider />
      <Mission />
      <Projects />
      <News />
      <Members />
      <Contact />
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <TranslationProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<AllProjectsPage />} />
          <Route path="/events" element={<AllEventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/media" element={<OurMedia />} />
        </Routes>
      </Router>
    </TranslationProvider>
  );
}

export default App;
