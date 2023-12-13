import React from 'react';
import { useMsalAuthentication } from '@azure/msal-react';
import { InteractionType } from '@azure/msal-browser';

function LoginPage() {
    useMsalAuthentication(InteractionType.Redirect);
    return <>Please wait...</>;
}

export default LoginPage;
