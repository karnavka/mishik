import { getRole, isLoggedIn } from '../utils/auth';

export const useAuth = () => {
  const loggedIn = isLoggedIn();
  const role = getRole();

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