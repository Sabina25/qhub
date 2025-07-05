import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

import ScrollToTop from './ScrollToTop';

const Home = () => (
  <>
    <Header />
    <main>
      <Hero />
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
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<AllProjectsPage />} />
        <Route path="/events" element={<AllEventsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
