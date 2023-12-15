import React from 'react';
import { AppProps } from 'next/app';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import LoginPage from './../components/login';
import RootLayout from './../components/RootLayout';
import { msalConfig } from './../components/msalConfig';
import '../styles/globals.css';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
    const msalInstance = new PublicClientApplication(msalConfig);

    return (
        <>
            <MsalProvider instance={msalInstance}>
                <LoginPage/>
                <RootLayout>
                    <Component {...pageProps} />
                </RootLayout>
            </MsalProvider>
        </>
    );
};

export default App;