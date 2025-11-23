import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f5f5f7' }}>
      <Header />
      <main className="flex-1" style={{ backgroundColor: '#f5f5f7' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;