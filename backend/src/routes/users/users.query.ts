/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { dataBase } from '../../config/db.js';
import { User } from '../../entity/user.js';

async function userConnection(endpoint: string, accessToken: string): Promise<any> {
    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };
    try {
        const response = await fetch(endpoint, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        throw new Error(error);
    }
}

async function createUser(userData: any): Promise<any> {
    let exist = await dataBase.getRepository(User).createQueryBuilder('user').where('user.email = :email', { email: userData.userPrincipalName }).getOne();
    if (!exist) {
        const user = new User();
        user.email = userData.mail;
        user.token = userData.id;
        user.role = false;
        const data = await dataBase.getRepository(User).save(user);
    }
};

export { userConnection, createUser };
