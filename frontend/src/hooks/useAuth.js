import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Convenience hook to access AuthContext values.
 * Usage: const { user, login, logout, register } = useAuth();
 */
const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
