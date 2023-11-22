import React from 'react';
import '../styles/globals.css';
import RootLayout from './RootLayout';
import { AppProps } from 'next/app';

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
};

export default MyApp;
