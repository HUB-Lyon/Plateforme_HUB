import React from 'react';
import NavBar from './NavBar';
import Head from 'next/head';

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <div>
      <Head>
        <title>Site Hub</title>
        <link rel="icon" type="image/vnd.icon" href="/image/epitech_logo.ico" />
      </Head>
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
