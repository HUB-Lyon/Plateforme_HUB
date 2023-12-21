import React from 'react';
import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import { AuthenticatedTemplate, MsalProvider, UnauthenticatedTemplate } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import LoginPage from '../components/login';
import RootLayout from './../components/RootLayout';
import { msalConfig } from './../components/msalConfig';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
    const msalInstance = new PublicClientApplication(msalConfig);

    return (
        <>
            <MsalProvider instance={msalInstance}>
                <AuthenticatedTemplate>
                    <RootLayout>
                        <Component {...pageProps} />
                        <ToastContainer
                            position= 'top-right'
                            autoClose= {5000}
                            hideProgressBar= {false}
                            closeOnClick= {true}
                            pauseOnHover= {true}
                            draggable= {false}
                        />
                    </RootLayout>
                </AuthenticatedTemplate>
                <UnauthenticatedTemplate>
                    <LoginPage/>
                </UnauthenticatedTemplate>
            </MsalProvider>
        </>
    );
};

export default App;
