import React from 'react';
import { AppProps } from 'next/app';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import LoginPage from './component/login';
import RootLayout from './component/RootLayout';
import { msalConfig } from './component/msalConfig';
import '../styles/globals.css';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
    const msalInstance = new PublicClientApplication(msalConfig);

    return (
        <>
            <MsalProvider instance={msalInstance}>
                <LoginPage/>
            </MsalProvider>
            <RootLayout>
                <Component {...pageProps} />
            </RootLayout>
        </>
    );
};

export default App;