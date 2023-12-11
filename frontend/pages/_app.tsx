import React from 'react';
import '../styles/globals.css';
import RootLayout from '../components/RootLayout';
import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <RootLayout>
            <Component {...pageProps} />
            <ToastContainer />
        </RootLayout>
    );
};

export default App;
