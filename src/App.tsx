import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import DataImportPage from './pages/DataImportPage';
import SalesPage from './pages/SalesPage';
import LoginPage from './pages/LoginPage';
import RequireAuth from './components/RequireAuth';
import { useAuth } from './context/AuthContext';

// Rol bazlı yönlendirme komponenti
const RoleBasedRedirect: React.FC = () => {
  const { user } = useAuth();
  return <Navigate to={user?.role === 'admin' ? '/' : '/dashboard'} replace />;
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Admin sayfaları */}
            <Route
              path="/"
              element={
                <RequireAuth allowedRoles={['admin']}>
                  <Layout>
                    <HomePage />
                  </Layout>
                </RequireAuth>
              }
            />
            
            {/* Tüm kullanıcılar için sayfalar */}
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </RequireAuth>
              }
            />
            
            <Route
              path="/data-import"
              element={
                <RequireAuth allowedRoles={['admin']}>
                  <Layout>
                    <DataImportPage />
                  </Layout>
                </RequireAuth>
              }
            />
            
            <Route
              path="/sales"
              element={
                <RequireAuth>
                  <Layout>
                    <SalesPage />
                  </Layout>
                </RequireAuth>
              }
            />

            {/* Bilinmeyen rotaları role göre yönlendir */}
            <Route path="*" element={
              <RequireAuth>
                <RoleBasedRedirect />
              </RequireAuth>
            } />
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;