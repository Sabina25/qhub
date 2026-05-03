import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TranslationProvider } from './context/TranslationContext';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

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

const SECTIONS = ['home', 'organisation', 'news', 'projects', 'members', 'team', 'contact'];
const LAST_SNAP_IDX = SECTIONS.length - 1;

const getVh = () => window.visualViewport?.height ?? window.innerHeight;
const isMobile = () => window.innerWidth < 1024;

/* ── Десктоп: snap-layout ── */
const DesktopHome = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    document.documentElement.classList.add('snap-active');
    return () => document.documentElement.classList.remove('snap-active');
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollTop / getVh());
      const clamped = Math.min(idx, SECTIONS.length - 1);
      setActiveIdx(clamped);
      if (clamped >= LAST_SNAP_IDX) {
        el.style.scrollSnapType = 'none';
      } else {
        el.style.scrollSnapType = 'y proximity';
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (idx: number) => {
    const el = containerRef.current;
    if (!el) return;
    el.style.scrollSnapType = 'y proximity';
    el.scrollTo({ top: idx * getVh(), behavior: 'smooth' });
  };

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
      <div className="home-bg" aria-hidden="true"><NeuralNetwork /></div>
      <Header />
      <nav className="snap-dots" aria-label="Sections">
        {SECTIONS.map((id, i) => (
          <button key={id} className={`snap-dot${activeIdx === i ? ' active' : ''}`}
            onClick={() => goTo(i)} aria-label={id} />
        ))}
      </nav>
      <div className="snap-container" ref={containerRef}>
        <section id="home"         className="snap-section snap-section--hero">    <Hero />    </section>
        <section id="organisation" className="snap-section snap-section--content"> <Mission /> </section>
        <section id="news"         className="snap-section snap-section--content"> <News />    </section>
        <section id="projects"     className="snap-section snap-section--content"> <Projects /></section>
        <section id="members"      className="snap-section snap-section--content snap-section--compact"> <Members /> </section>
        <section id="contact"      className="snap-section snap-section--content snap-section--contact"><Contact /></section>
        <section><Footer /></section>
      </div>
    </div>
  );
};

/* ── Мобайл: обычный скролл ── */
const MobileHome = () => (
  <div style={{ background: '#080c14', minHeight: '100dvh', position: 'relative' }}>
    <AnnouncementBanner />
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: '#080c14' }}>
      <NeuralNetwork />
    </div>
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Header />
      <section id="home"         style={{ minHeight: '100dvh' }}><Hero /></section>
      <section id="organisation" style={{ padding: '60px 0 40px' }}><Mission /></section>
      <section id="news"         style={{ padding: '60px 0 40px' }}><News /></section>
      <section id="projects"     style={{ padding: '60px 0 40px' }}><Projects /></section>
      <section id="members"      style={{ padding: '60px 0 40px' }}><Members /></section>
      <section id="contact"      style={{ padding: '60px 0 40px' }}><Contact /><Footer /></section>
    </div>
  </div>
);

const Home = () => {
  const [mobile, setMobile] = useState(isMobile());

  useEffect(() => {
    const onResize = () => setMobile(isMobile());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return mobile ? <MobileHome /> : <DesktopHome />;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <AuthProvider>
      <TranslationProvider>
        <Router>
        <ScrollToTop />
          <Routes>
            <Route path="/"             element={<Home />} />
            <Route path="/events"       element={<AllEventsPage />} />
            <Route path="/projects"     element={<AllProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/events/:id"   element={<EventDetailPage />} />
            <Route path="/media"        element={<OurMediaPage />} />
            <Route path="/login"        element={<Login />} />
            <Route path="/admin/*" element={
              <RequireAuth><AdminLayout /></RequireAuth>
            }>
              <Route index              element={<AdminMenu />} />
              <Route path="add-news"    element={<CreateNews />} />
              <Route path="add-project" element={<CreateProject />} />
            </Route>
          </Routes>
        </Router>
      </TranslationProvider>
    </AuthProvider>
  );
}

export default App;
