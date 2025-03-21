import React, { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navbar />
      <main className="ml-64 flex-1 p-6">{children}</main>
    </div>
  );
};

export default Layout;