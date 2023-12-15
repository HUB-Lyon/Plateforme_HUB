import React from 'react';
import '../styles/globals.css';
import RootLayout from '../components/RootLayout';
import { AppProps } from 'next/app';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <RootLayout>
            <Component {...pageProps} />
        </RootLayout>
    );
};

export default App;
