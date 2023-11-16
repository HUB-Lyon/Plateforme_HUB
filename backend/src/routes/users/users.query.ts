/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import axios, { AxiosResponse } from 'axios';

async function user_connection(endpoint: string, accessToken: string): Promise<any> {
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };
    console.log(`Request made to ${endpoint} at : ` + new Date().toString());
    try {
        const response: AxiosResponse = await axios.get(endpoint, options);
        return await response.data;
    } catch (error) {
        throw new Error(error);
    }
}

export { user_connection };
