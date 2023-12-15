import React from 'react';
import Head from 'next/head';
import NavBar from './NavBar';

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
    return (
        <>
            <Head>
                <title>Site Hub</title>
                <link rel="icon" type="image/vnd.icon" href="/image/favicon.ico" />
            </Head>
            <NavBar />
            <div className="lg:ml-72 mt-16">
                {children}
            </div>
        </>
    );
};

export default RootLayout;

interface RootLayoutProps {
  children: React.ReactNode;
}
