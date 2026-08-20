import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileNavigation } from './components/layout/MobileNavigation';
import { ScrollToTop } from './components/common/ScrollToTop';
import { Home } from './pages/Home';
import { Designer } from './pages/Designer';
import { Gallery } from './pages/Gallery';
import { About } from './pages/About';

export function App() {
  const basename = import.meta.env.BASE_URL || '/';

  return (
    <Router basename={basename} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/designer" element={<Designer />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
        <ScrollToTop />
        <MobileNavigation />
      </div>
    </Router>
  );
}

export default App;
