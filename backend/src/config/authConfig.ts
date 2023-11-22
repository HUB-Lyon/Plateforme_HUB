import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL Node configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
 */
interface MsalConfig {
    auth: {
        clientId: string; // 'Application (client) ID' of app registration in Azure portal - this value is a GUID
        authority: string; // Full directory URL, in the form of https://login.microsoftonline.com/<tenant>
        clientSecret: string; // Client secret generated from the app registration in Azure portal
    };
    system: {
        loggerOptions: {
            loggerCallback(loglevel: number, message: string, containsPii: boolean): void;
            piiLoggingEnabled: boolean;
            logLevel: number;
        };
    };
}

const msalConfig: MsalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID!,
        authority: process.env.CLOUD_INSTANCE + process.env.TENANT_ID!,
        clientSecret: process.env.CLIENT_SECRET!
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: 3,
        }
    }
};

const REDIRECT_URI: string = process.env.REDIRECT_URI!;
const POST_LOGOUT_REDIRECT_URI: string = process.env.POST_LOGOUT_REDIRECT_URI!;
const GRAPH_ME_ENDPOINT: string = process.env.GRAPH_API_ENDPOINT + 'v1.0/me';

export {
    msalConfig,
    REDIRECT_URI,
    POST_LOGOUT_REDIRECT_URI,
    GRAPH_ME_ENDPOINT
};
