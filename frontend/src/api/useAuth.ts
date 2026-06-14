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
    isModerator: role === 'ROLE_MODERATOR' || role === 'ROLE_ADMIN',
    isUser: role === 'ROLE_USER',
    isShelter: role === 'ROLE_SHELTER',
  };
  
};
export const notifyAuthChange = () => window.dispatchEvent(new Event('auth-change'));