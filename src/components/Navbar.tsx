import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, FileSpreadsheet, Home, Smartphone, Award, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-[#2855ac]' : '';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMenu}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-[#001c54] text-white md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Navbar */}
      <nav className={`bg-[#001c54] text-white h-screen fixed top-0 shadow-lg z-50 transition-all duration-300 
        ${isOpen ? 'left-0' : '-left-64'} w-64 md:left-0`}>
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <img 
              src="https://ffo3gv1cf3ir.merlincdn.net/SiteAssets/Hakkimizda/render/genel/turkcell-logo/turkcell-logo_325x244.png?1742517958000" 
              alt="Turkcell Logo" 
              className="h-6 brightness-0 invert"
            />
            <h1 className="text-xl font-bold">Okay İletişim</h1>
          </div>
          <p className="text-sm text-gray-400">Proje: Abbas ALP</p>
          <div className="mt-2 text-sm">
            <p>Kullanıcı: {user?.username}</p>
            <p>Rol: {user?.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}</p>
          </div>
        </div>
        
        <div className="mt-8">
          <ul>
            {user?.role === 'admin' && (
              <li className={`px-4 py-3 hover:bg-[#2855ac] transition-colors ${isActive('/')}`}>
                <Link to="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                  <Home size={20} />
                  <span>Ana Sayfa</span>
                </Link>
              </li>
            )}
            <li className={`px-4 py-3 hover:bg-[#2855ac] transition-colors ${isActive('/dashboard')}`}>
              <Link to="/dashboard" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                <BarChart3 size={20} />
                <span>Dashboard</span>
              </Link>
            </li>
            {user?.role === 'admin' && (
              <li className={`px-4 py-3 hover:bg-[#2855ac] transition-colors ${isActive('/data-import')}`}>
                <Link to="/data-import" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                  <FileSpreadsheet size={20} />
                  <span>Veri İçe Aktar</span>
                </Link>
              </li>
            )}
            <li className={`px-4 py-3 hover:bg-[#2855ac] transition-colors ${isActive('/sales')}`}>
              <Link to="/sales" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                <Award size={20} />
                <span>Personel Performansı</span>
              </Link>
            </li>
          </ul>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-[#2855ac] transition-colors text-left"
          >
            <LogOut size={20} />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;