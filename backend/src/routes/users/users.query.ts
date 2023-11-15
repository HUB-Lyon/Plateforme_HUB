/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import axios, { AxiosResponse } from 'axios';

/**
 * Attaches a given access token to an MS Graph API call
 * @param {string} endpoint - REST API endpoint to call
 * @param {string} accessToken - Raw access token string
 * @returns {Promise<any>} - Result of the request
 */
async function user_connection(endpoint: string, accessToken: string): Promise<any> {
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };
    console.log(`Requête effectuée à ${endpoint} à : ` + new Date().toString());
    try {
        const response: AxiosResponse = await axios.get(endpoint, options);
        return response.data;
    } catch (error) {
        throw new Error(error);
    }
}

export { user_connection };
