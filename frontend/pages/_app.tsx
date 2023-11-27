import React from 'react';
import '../styles/globals.css';
import RootLayout from './component/RootLayout';
import LoginLayout from './component/LoginLayout';
import { AppProps } from 'next/app';
import Login from './login';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <>
            {Component !== Login && (
                <RootLayout>
                    <Component {...pageProps} />
                </RootLayout>
            )}
            {Component === Login && (
                <LoginLayout>
                    <Component {...pageProps} />
                </LoginLayout>
            )}
        </>
    );
};

export default App;
