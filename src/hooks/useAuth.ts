import { useState, useEffect } from 'react';
import { User, AuthState } from '../types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null
  });

  // Загрузка состояния авторизации при запуске
  useEffect(() => {
    const savedAuth = localStorage.getItem('wfrp-auth');
    if (savedAuth) {
      try {
        const parsedAuth: AuthState = JSON.parse(savedAuth);
        // Проверяем, не истекла ли сессия (24 часа)
        if (parsedAuth.user && parsedAuth.user.loginTime) {
          const loginTime = new Date(parsedAuth.user.loginTime).getTime();
          const currentTime = new Date().getTime();
          const hoursPassed = (currentTime - loginTime) / (1000 * 60 * 60);
          
          if (hoursPassed < 24) {
            setAuthState(parsedAuth);
          } else {
            // Сессия истекла
            localStorage.removeItem('wfrp-auth');
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки данных авторизации:', error);
        localStorage.removeItem('wfrp-auth');
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    // Простая проверка логина и пароля
    if (username === 'admin' && password === 'admin123') {
      const user: User = {
        username: 'admin',
        role: 'admin',
        loginTime: new Date().toISOString()
      };

      const newAuthState: AuthState = {
        isAuthenticated: true,
        user: user
      };

      setAuthState(newAuthState);
      localStorage.setItem('wfrp-auth', JSON.stringify(newAuthState));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null
    });
    localStorage.removeItem('wfrp-auth');
  };

  const isAdmin = (): boolean => {
    return authState.isAuthenticated && authState.user?.role === 'admin';
  };

  const canEdit = (): boolean => {
    return isAdmin();
  };

  const canCreate = (): boolean => {
    return isAdmin();
  };

  return {
    authState,
    login,
    logout,
    isAdmin,
    canEdit,
    canCreate,
    isAuthenticated: authState.isAuthenticated,
    user: authState.user
  };
};
