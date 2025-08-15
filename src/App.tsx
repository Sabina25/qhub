import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TranslationProvider } from './context/TranslationContext';

import RequireAuth from './auth/RequireAuth';
import AdminLayout from './components/AdminLayout';
import { AuthProvider } from './auth/AuthContext';  

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
import Login from './pages/Login';

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
    <AuthProvider>   
    <TranslationProvider>
      <Router>
        <ScrollToTop />
        <Routes>
        
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<AllProjectsPage />} />
          <Route path="/events" element={<AllEventsPage />} />
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
