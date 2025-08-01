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
import AllEventsPage from './pages/AllEventsPage';
import AllProjectsPage from './pages/AllProjectsPage';
import WaveDivider from './components/WaveDivider';
import EventDetailPage from './pages/EventDetailPage';
import OurMediaPage from './pages/OurMediaPage';
import CreateNews from './pages/CreateNewsPage';
import AdminMenu from './components/AdminMenu';
import CreateProject from './pages/ CreateProjectPage';


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
          <Route path="/media" element={<OurMediaPage />} />
          <Route path="/admin" element={<AdminMenu />} />
          <Route path="/admin/add-news" element={<CreateNews />} />
          <Route path="/admin/add-project" element={<CreateProject />} />
        </Routes>
      </Router>
    </TranslationProvider>
  );
}

export default App;
