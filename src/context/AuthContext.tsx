import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthState, LoginCredentials } from '../types/auth';

// Örnek kullanıcılar (gerçek uygulamada bir backend API'den gelecek)
const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // Gerçek uygulamada şifreler hash'lenmiş olmalı
    role: 'admin'
  },
  {
    id: '2',
    username: 'user',
    password: 'user123',
    role: 'user'
  }
];

const STORAGE_KEY = 'turkcell_magaza_auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const savedAuth = localStorage.getItem(STORAGE_KEY);
    return savedAuth ? JSON.parse(savedAuth) : {
      user: null,
      isAuthenticated: false
    };
  });

  // Oturum durumu değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (authState.isAuthenticated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authState));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [authState]);

  const login = async (credentials: LoginCredentials) => {
    // Gerçek uygulamada bu işlem bir API çağrısı olacak
    const user = MOCK_USERS.find(
      u => u.username === credentials.username && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Geçersiz kullanıcı adı veya şifre');
    }

    setAuthState({
      user,
      isAuthenticated: true
    });
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 