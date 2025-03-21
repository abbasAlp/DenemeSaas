import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginCredentials } from '../types/auth';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

  // Kullanıcı zaten giriş yapmışsa yönlendir
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role === 'admin' ? '/' : '/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(credentials);
      // Login başarılı olduğunda useEffect yönlendirmeyi yapacak
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <img 
            src="https://ffo3gv1cf3ir.merlincdn.net/SiteAssets/Hakkimizda/render/genel/turkcell-logo/turkcell-logo_325x244.png?1742517958000" 
            alt="Turkcell Logo" 
            className="h-8 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-[#001c54]">Okay İletişim</h1>
          <p className="text-gray-600">Yönetim Sistemine Hoş Geldiniz</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Kullanıcı Adı
            </label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2855ac]"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Şifre
            </label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2855ac]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#2855ac] text-white py-2 px-4 rounded-md hover:bg-[#001c54] transition-colors"
          >
            Giriş Yap
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Demo Hesapları:</p>
          <p>Admin: admin / admin123</p>
          <p>Kullanıcı: user / user123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 