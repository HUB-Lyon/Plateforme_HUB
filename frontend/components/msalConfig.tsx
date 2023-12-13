export const msalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID || 'ee231684-7664-48cf-9162-2468545eac5e',
        authority: `${'https://login.microsoftonline.com/'}${'901cb4ca-b862-4029-9306-e5cd0f6d9f86'}`,
        redirectUri: process.env.REDIRECT_URI || 'http://localhost:3001/auth/redirect',
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
    },
};
