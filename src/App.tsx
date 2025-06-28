import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Mission from './components/Mission';
import Projects from './components/Projects';
import AnnualMeeting from './components/AnnualMeeting';
import GE4Cities from './components/GE4Cities';
import News from './components/News';
import Members from './components/Members';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Mission />
        <Projects />
        <AnnualMeeting />
       {/* <GE4Cities />*/}
        <News />
        <Members />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;