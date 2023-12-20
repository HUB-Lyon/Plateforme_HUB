import React from 'react';
import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import RootLayout from './../components/RootLayout';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css';

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
    return (
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
    );
};

export default App;
