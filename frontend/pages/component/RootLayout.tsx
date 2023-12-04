import React from 'react';
import NavBar from './NavBar';
import Head from 'next/head';

export const toggleTheme = (): boolean => {
    if (typeof window !== 'undefined') {
        const newTheme = isDarkTheme() ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        return newTheme === 'dark';
    }
    return false;
};

export function isDarkTheme() {
    if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            return true;
        }
        return false;
    }
    return false;
}

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
