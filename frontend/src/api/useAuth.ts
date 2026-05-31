import { getRole, isLoggedIn } from '../utils/auth';
import { useEffect, useState } from 'react';


export const useAuth = () => {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [role, setRole] = useState(getRole());

  useEffect(() => {
    const handleAuthChange = () => {
      setLoggedIn(isLoggedIn());
      setRole(getRole());
    };

    window.addEventListener('auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  return {
    loggedIn,
    role,
    isAdmin: role === 'ADMIN',
    isModerator: role === 'MODERATOR' || role === 'ADMIN',
    isUser: role === 'USER',
    isShelter: role === 'SHELTER',
  };
  
};
export const notifyAuthChange = () => window.dispatchEvent(new Event('auth-change'));