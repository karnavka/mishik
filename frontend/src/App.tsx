import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';


import { Header }      from './components/Header';
import { LoginModal }  from './components/LoginModal';
import { AnimalsPage } from './pages/AnimalsPage';
import { SheltersPage } from './pages/SheltersPage';
import { EventsPage }  from './pages/EventsPage';
import { ProfilePage } from './pages/ProfilePage';
import { useTheme } from './api/useTheme';

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const { dark, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <div className="app">
        <Header onLoginClick={() => setShowLogin(true)} dark={dark} onThemeToggle={toggleTheme} />

        <Routes>
          <Route path="/"         element={<AnimalsPage  onLoginRequest={() => setShowLogin(true)} />} />
          <Route path="/shelters" element={<SheltersPage onLoginRequest={() => setShowLogin(true)} />} />
          <Route path="/events"   element={<EventsPage   onLoginRequest={() => setShowLogin(true)} />} />
          <Route path="/profile"  element={<ProfilePage />} />
        </Routes>

        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      </div>
    </BrowserRouter>
  );
}