import React from 'react';
import Head from 'next/head';

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
    return (
        <>
            <Head>
                <title>Site Hub</title>
                <link rel="icon" type="image/vnd.icon" href="/image/favicon.ico" />
            </Head>
            {children}
        </>
    );
};

export default LoginLayout;

interface LoginLayoutProps {
  children: React.ReactNode;
}
