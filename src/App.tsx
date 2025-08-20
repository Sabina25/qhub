import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TranslationProvider } from './context/TranslationContext';

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
import WaveDivider from './components/mainPage/WaveDivider';
import EventDetailPage from './pages/EventDetailPage';
import OurMediaPage from './pages/OurMediaPage';
import CreateNews from './pages/CreateNewsPage';
import AdminMenu from './components/admin/AdminMenu';
import CreateProject from './pages/CreateProjectPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
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
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
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
