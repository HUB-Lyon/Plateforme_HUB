import * as dotenv from 'dotenv';
import * as msal from '@azure/msal-node';

import { msalConfig } from '../config/authConfig.js';

dotenv.config({ path: '.env.dev' });

class AuthProvider {
    msalConfig: msal.Configuration;
    cryptoProvider: msal.CryptoProvider;

    constructor(msalConfig: msal.Configuration) {
        this.msalConfig = msalConfig;
        this.cryptoProvider = new msal.CryptoProvider();
    }

    login(options: any = {}) {
        return async (req: any, res: any, next: any) => {
            const state = this.cryptoProvider.base64Encode(
                JSON.stringify({
                    successRedirect: options.successRedirect || '/',
                })
            );

            const authCodeUrlRequestParams: msal.AuthorizationUrlRequest = {
                state: state,
                scopes: options.scopes || [],
                redirectUri: options.redirectUri,
            };

            const authCodeRequestParams: msal.AuthorizationCodeRequest = {
                state: state,
                scopes: options.scopes || [],
                redirectUri: options.redirectUri,
                code: '',
            };

            if (!this.msalConfig.auth.cloudDiscoveryMetadata || !this.msalConfig.auth.authorityMetadata) {
                const [cloudDiscoveryMetadata, authorityMetadata] = await Promise.all([
                    this.getCloudDiscoveryMetadata(this.msalConfig.auth.authority),
                    this.getAuthorityMetadata(this.msalConfig.auth.authority),
                ]);

                this.msalConfig.auth.cloudDiscoveryMetadata = JSON.stringify(cloudDiscoveryMetadata);
                this.msalConfig.auth.authorityMetadata = JSON.stringify(authorityMetadata);
            }

            const msalInstance = this.getMsalInstance(this.msalConfig);

            return this.redirectToAuthCodeUrl(
                authCodeUrlRequestParams,
                authCodeRequestParams,
                msalInstance
            )(req, res, next);
        };
    }

    acquireToken(options: any = {}) {
        return async (req: any, res: any, next: any) => {
            try {
                const msalInstance = this.getMsalInstance(this.msalConfig);

                if (req.session.tokenCache) {
                    msalInstance.getTokenCache().deserialize(req.session.tokenCache);
                }

                const tokenResponse = await msalInstance.acquireTokenSilent({
                    account: req.session.account,
                    scopes: options.scopes || [],
                });

                req.session.tokenCache = msalInstance.getTokenCache().serialize();
                req.session.accessToken = tokenResponse.accessToken;
                req.session.idToken = tokenResponse.idToken;
                req.session.account = tokenResponse.account;

                res.redirect(options.successRedirect);
            } catch (error) {
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

                if (req.session.tokenCache) {
                    msalInstance.getTokenCache().deserialize(req.session.tokenCache);
                }

                const tokenResponse = await msalInstance.acquireTokenByCode(authCodeRequest, req.body);

                req.session.tokenCache = msalInstance.getTokenCache().serialize();
                req.session.idToken = tokenResponse.idToken;
                req.session.account = tokenResponse.account;
                req.session.isAuthenticated = true;

                const state = JSON.parse(this.cryptoProvider.base64Decode(req.body.state));
                res.redirect(state.successRedirect);
            } catch (error) {
                next(error);
            }
        };
    }

    logout(options: any = {}) {
        return (req: any, res: any, next: any) => {
            let logoutUri = `${this.msalConfig.auth.authority}/oauth2/v2.0/`;

            if (options.postLogoutRedirectUri) {
                logoutUri += `logout?post_logout_redirect_uri=${options.postLogoutRedirectUri}`;
            }

            req.session.destroy(() => {
                res.redirect(logoutUri);
            });
        };
    }

    getMsalInstance(msalConfig: msal.Configuration): msal.ConfidentialClientApplication {
        return new msal.ConfidentialClientApplication(msalConfig);
    }

    redirectToAuthCodeUrl(
        authCodeUrlRequestParams: msal.AuthorizationUrlRequest,
        authCodeRequestParams: msal.AuthorizationCodeRequest,
        msalInstance: msal.ConfidentialClientApplication
    ) {
        return async (req: any, res: any, next: any) => {
            const { verifier, challenge } = await this.cryptoProvider.generatePkceCodes();

            req.session.pkceCodes = {
                challengeMethod: 'S256',
                verifier: verifier,
                challenge: challenge,
            };

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
                const authCodeUrlResponse = await msalInstance.getAuthCodeUrl(req.session.authCodeUrlRequest);
                res.redirect(authCodeUrlResponse);
            } catch (error) {
                next(error);
            }
        };
    }

    async getCloudDiscoveryMetadata(authority: string) {
        const endpoint = 'https://login.microsoftonline.com/common/discovery/instance';

        try {
            const response = await fetch(`${endpoint}?api-version=1.1&authorization_endpoint=${authority}/oauth2/v2.0/authorize`);
            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    async getAuthorityMetadata(authority: string) {
        const endpoint = `${authority}/v2.0/.well-known/openid-configuration`;

        try {
            const response = await fetch(endpoint);
            return await response.json();
        } catch (error) {
            console.log(error);
        }
    }
}

const authProvider = new AuthProvider(msalConfig);

export default authProvider;
