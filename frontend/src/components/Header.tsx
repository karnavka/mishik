import { Link, useLocation } from 'react-router-dom';
import { useAuth, notifyAuthChange } from '../api/useAuth';
import { logout } from '../utils/auth';


type Props = {
  onLoginClick: () => void;
  dark: boolean;
  onThemeToggle: () => void;
};

export const Header = ({ onLoginClick, dark, onThemeToggle }: Props) => {
  const { loggedIn, role } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    notifyAuthChange();
  };

  const navLinks = [
    { to: '/',        label: '🐾 Тварини' },
    { to: '/shelters', label: '🏠 Притулки' },
    { to: '/events',   label: '❤️ Події' },
  ];

  return (
    <header className="header" style={{ justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="logo">🐾 Mishik</span>
        {navLinks.map(({ to, label }) => (
          <Link key={to} to={to}
            className={'tab-btn' + (location.pathname === to ? ' active' : '')}
            style={{ textDecoration: 'none' }}
          >
            {label}
          </Link>
        ))}
      </div>
       <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button className="tab-btn" onClick={onThemeToggle}
          title={dark ? 'Світла тема' : 'Темна тема'}
          style={{ fontSize: 16, padding: '6px 10px' }} >
          {dark ? '☀' : '☁︎'}
        </button>
        {loggedIn ? (
          <>
            <Link to="/profile"
              className={'tab-btn' + (location.pathname === '/profile' ? ' active' : '')}
              style={{ textDecoration: 'none' }}
            >
              ☺︎ {role && <span style={{ fontSize: 11, color: '#aaa' }}></span>}
            </Link>
            <button className="tab-btn" onClick={handleLogout}>Вийти</button>
          </>
        ) : (
          <button className="tab-btn" onClick={onLoginClick}
            style={{ border: '1px solid #ccc', fontWeight: 500 }}
          >
            Увійти
          </button>
        )}
      </div>
    </header>
  );
};