import * as dotenv from 'dotenv';
import * as msal from '@azure/msal-node';

import { msalConfig } from '../config/authConfig.js';

// Configuration of environment variables
dotenv.config({ path: '.env.dev' });

// Class handling authentication with MSAL
class AuthProvider {
    msalConfig: msal.Configuration;
    cryptoProvider: msal.CryptoProvider;

    // Constructor of the class
    constructor(msalConfig: msal.Configuration) {
        this.msalConfig = msalConfig;
        this.cryptoProvider = new msal.CryptoProvider();
    }

    // Method to handle the login process
    login(options: any = {}) {
        return async (req: any, res: any, next: any) => {
            // Encoding the state for redirection after authentication
            const state = this.cryptoProvider.base64Encode(
                JSON.stringify({
                    successRedirect: options.successRedirect || '/',
                })
            );

            // Authorization URL request parameters
            const authCodeUrlRequestParams: msal.AuthorizationUrlRequest = {
                state: state,
                scopes: options.scopes || [],
                redirectUri: options.redirectUri,
            };

            // Authorization code request parameters
            const authCodeRequestParams: msal.AuthorizationCodeRequest = {
                state: state,
                scopes: options.scopes || [],
                redirectUri: options.redirectUri,
                code: '',
            };

            // Checking cloud discovery and authority metadata
            if (!this.msalConfig.auth.cloudDiscoveryMetadata || !this.msalConfig.auth.authorityMetadata) {
                const [cloudDiscoveryMetadata, authorityMetadata] = await Promise.all([
                    this.getCloudDiscoveryMetadata(this.msalConfig.auth.authority),
                    this.getAuthorityMetadata(this.msalConfig.auth.authority),
                ]);

                this.msalConfig.auth.cloudDiscoveryMetadata = JSON.stringify(cloudDiscoveryMetadata);
                this.msalConfig.auth.authorityMetadata = JSON.stringify(authorityMetadata);
            }

            const msalInstance = this.getMsalInstance(this.msalConfig);

            // Redirecting to the authorization URL
            return this.redirectToAuthCodeUrl(
                authCodeUrlRequestParams,
                authCodeRequestParams,
                msalInstance
            )(req, res, next);
        };
    }

    // Method to acquire an access token
    acquireToken(options: any = {}) {
        return async (req: any, res: any, next: any) => {
            try {
                const msalInstance = this.getMsalInstance(this.msalConfig);

                // Deserializing the token cache if it exists in the session
                if (req.session.tokenCache) {
                    msalInstance.getTokenCache().deserialize(req.session.tokenCache);
                }

                // Attempting silent acquisition of an access token
                const tokenResponse = await msalInstance.acquireTokenSilent({
                    account: req.session.account,
                    scopes: options.scopes || [],
                });

                // Updating the token cache in the session
                req.session.tokenCache = msalInstance.getTokenCache().serialize();
                req.session.accessToken = tokenResponse.accessToken;
                req.session.idToken = tokenResponse.idToken;
                req.session.account = tokenResponse.account;

                // Redirecting to the specified success page
                res.redirect(options.successRedirect);
            } catch (error) {
                // Handling errors, including interaction required for authentication
                if (error instanceof msal.InteractionRequiredAuthError) {
                    return this.login({
                        scopes: options.scopes || [],
                        redirectUri: options.redirectUri,
                        successRedirect: options.successRedirect || '/',
                    })(req, res, next);
                }

                next(error);
            }
        };
    }

    // Method to handle redirection after authentication
    handleRedirect(options: any = {}) {
        return async (req: any, res: any, next: any) => {
            if (!req.body || !req.body.state) {
                return next(new Error('Error: response not found'));
            }

            const authCodeRequest: msal.AuthorizationCodeRequest = {
                ...req.session.authCodeRequest,
                code: req.body.code,
                codeVerifier: req.session.pkceCodes.verifier,
            };

            try {
                const msalInstance = this.getMsalInstance(this.msalConfig);

                // Deserializing the token cache if it exists in the session
                if (req.session.tokenCache) {
                    msalInstance.getTokenCache().deserialize(req.session.tokenCache);
                }

                // Using the authorization code to acquire an access token
                const tokenResponse = await msalInstance.acquireTokenByCode(authCodeRequest, req.body);

                // Updating the token cache in the session
                req.session.tokenCache = msalInstance.getTokenCache().serialize();
                req.session.idToken = tokenResponse.idToken;
                req.session.account = tokenResponse.account;
                req.session.isAuthenticated = true;

                // Retrieving the state for redirection
                const state = JSON.parse(this.cryptoProvider.base64Decode(req.body.state));
                res.redirect(state.successRedirect);
            } catch (error) {
                next(error);
            }
        };
    }

    // Method to handle logout
    logout(options: any = {}) {
        return (req: any, res: any, next: any) => {
            // Constructing the logout URI and redirecting the user
            let logoutUri = `${this.msalConfig.auth.authority}/oauth2/v2.0/`;

            if (options.postLogoutRedirectUri) {
                logoutUri += `logout?post_logout_redirect_uri=${options.postLogoutRedirectUri}`;
            }

            // Destroying the session and redirecting
            req.session.destroy(() => {
                res.redirect(logoutUri);
            });
        };
    }

    // Method to get a new MSAL ConfidentialClientApplication instance
    getMsalInstance(msalConfig: msal.Configuration): msal.ConfidentialClientApplication {
        return new msal.ConfidentialClientApplication(msalConfig);
    }

    // Method to prepare the authorization URL request and initiate the authorization code flow
    redirectToAuthCodeUrl(
        authCodeUrlRequestParams: msal.AuthorizationUrlRequest,
        authCodeRequestParams: msal.AuthorizationCodeRequest,
        msalInstance: msal.ConfidentialClientApplication
    ) {
        return async (req: any, res: any, next: any) => {
            // Generating PKCE codes before starting the authorization flow
            const { verifier, challenge } = await this.cryptoProvider.generatePkceCodes();

            // Configuring the generated PKCE codes as session variables
            req.session.pkceCodes = {
                challengeMethod: 'S256',
                verifier: verifier,
                challenge: challenge,
            };

            // Manipulating request objects below before each request to obtain authentication artifacts with desired claims
            req.session.authCodeUrlRequest = {
                ...authCodeUrlRequestParams,
                responseMode: msal.ResponseMode.FORM_POST,
                codeChallenge: req.session.pkceCodes.challenge,
                codeChallengeMethod: req.session.pkceCodes.challengeMethod,
            };

            req.session.authCodeRequest = {
                ...authCodeRequestParams,
                code: '',
            };

            try {
                // Getting the authorization URL from MSAL
                const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(req.session.authCodeUrlRequest);
                res.redirect(authCodeUrlResponse);
            } catch (error) {
                next(error);
            }
        };
    }

    // Method to retrieve cloud discovery metadata
    async getCloudDiscoveryMetadata(authority: string) {
        const endpoint = 'https://login.microsoftonline.com/common/discovery/instance';

        try {
            // Calling the cloud discovery API
            const response = await fetch(`${endpoint}?api-version=1.1&authorization_endpoint=${authority}/oauth2/v2.0/authorize`);
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    // Method to retrieve OIDC authority metadata
    async getAuthorityMetadata(authority: string) {
        const endpoint = `${authority}/v2.0/.well-known/openid-configuration`;

        try {
            // Calling the API to retrieve OIDC authority metadata
            const response = await fetch(endpoint);
            return await response.json();
        } catch (error) {
            console.log(error);
        }
    }
}

// Instance of the AuthProvider class with MSAL configuration
const authProvider = new AuthProvider(msalConfig);

// Exporting the instance of the class
export default authProvider;
