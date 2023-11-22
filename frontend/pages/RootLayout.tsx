import React from 'react';
import NavBar from './NavBar';

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <div>
      <NavBar />
      <div className="lg:ml-72 mt-16">
        <div>{children}</div>
      </div>
    </div>
  );
};

export default RootLayout;

interface RootLayoutProps {
  children: React.ReactNode;
}
