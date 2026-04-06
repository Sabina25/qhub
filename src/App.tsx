import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TranslationProvider } from './context/TranslationContext';
import { useEffect, useRef, useState } from 'react';

import RequireAuth from './auth/RequireAuth';
import AdminLayout from './components/admin/AdminLayout';
import { AuthProvider } from './auth/AuthContext';

import Header from './components/header/Header';
import Hero from './components/mainPage/Hero';
import Mission from './components/mainPage/Mission';
import Projects from './components/mainPage/Projects';
import News from './components/mainPage/News';
import Members from './components/mainPage/Members';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AllEventsPage from './pages/AllEventsPage';
import AllProjectsPage from './pages/AllProjectsPage';
import EventDetailPage from './pages/EventDetailPage';
import OurMediaPage from './pages/OurMediaPage';
import CreateNews from './pages/CreateNewsPage';
import AdminMenu from './components/admin/AdminMenu';
import CreateProject from './pages/CreateProjectPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import Login from './pages/Login';
import NeuralNetwork from './components/NeuralNetwork';
import AnnouncementBanner from './components/AnnouncementBanner';

import './components/mainPage/HomeSnap.css';

// ── Секции ──────────────────────────────────────────────────────
const SECTIONS = ['home', 'organisation', 'news', 'projects', 'members', 'contact'];

const Home = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Включаем overflow:hidden на html/body пока на главной
  useEffect(() => {
    document.documentElement.classList.add('snap-active');
    return () => document.documentElement.classList.remove('snap-active');
  }, []);

  // Следим за активной секцией через scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollTop / window.innerHeight);
      setActiveIdx(Math.min(idx, SECTIONS.length - 1));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (idx: number) => {
    containerRef.current?.scrollTo({
      top: idx * window.innerHeight,
      behavior: 'smooth',
    });
  };

  // Позволяем Header скроллить к секции
  useEffect(() => {
    (window as any).__snapGoTo = (id: string) => {
      const idx = SECTIONS.indexOf(id);
      if (idx >= 0) goTo(idx);
    };
    return () => { delete (window as any).__snapGoTo; };
  }, []);

  return (
    <div className="home-wrapper">
      <AnnouncementBanner />
      {/* Фиксированный фон */}
      <div className="home-bg" aria-hidden="true">
        <NeuralNetwork />
      </div>

      {/* Header поверх всего */}
      <Header />

      {/* Dots-навигация */}
      <nav className="snap-dots" aria-label="Sections">
        {SECTIONS.map((id, i) => (
          <button
            key={id}
            className={`snap-dot${activeIdx === i ? ' active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={id}
          />
        ))}
      </nav>

      {/* Scroll-snap контейнер */}
      <div className="snap-container" ref={containerRef}>

        {/* 1. Hero */}
        <section id="home" className="snap-section snap-section--hero">
          <Hero />
        </section>

        {/* 2. Mission */}
        <section id="organisation" className="snap-section snap-section--content">
          <Mission />
        </section>

        {/* 3. News */}
        <section id="news" className="snap-section snap-section--content">
          <News />
        </section>

        {/* 4. Projects */}
        <section id="projects" className="snap-section snap-section--content">
          <Projects />
        </section>

        {/* 5. Members */}
        <section id="members" className="snap-section snap-section--content">
          <Members />
        </section>

        {/* 6. Contact + Footer */}
        <section id="contact" className="snap-section snap-section--content">
          <Contact />
          <Footer />
        </section>

      </div>
    </div>
  );
};

// ── App ──────────────────────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <TranslationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<AllEventsPage />} />
            <Route path="/projects" element={<AllProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/media" element={<OurMediaPage />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/admin/*"
              element={
                <RequireAuth>
                  <AdminLayout />
                </RequireAuth>
              }
            >
              <Route index element={<AdminMenu />} />
              <Route path="add-news" element={<CreateNews />} />
              <Route path="add-project" element={<CreateProject />} />
            </Route>
          </Routes>
        </Router>
      </TranslationProvider>
    </AuthProvider>
  );
}

export default App;
