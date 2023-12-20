import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export const msalConfig = {
    auth: {
        clientId: process.env.NEXT_PUBLIC_CLIENT_ID || '',
        authority: 'https://login.microsoftonline.com/' + (process.env.NEXT_PUBLIC_TENANT_ID || ''),
        redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || '',
    },
    cache: {
        cacheLocation: 'sessionStorage', 
        storeAuthStateInCookie: true, 
    },
};
