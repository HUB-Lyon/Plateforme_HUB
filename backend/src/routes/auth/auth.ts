/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import express from 'express';
import { Request, Response, Router } from 'express';

import authProvider from '../../auth/AuthProvider.js';
import { REDIRECT_URI, POST_LOGOUT_REDIRECT_URI } from '../../config/authConfig.js';

import { User } from '../../entity/user.js';
import { dataBase } from '../../config/db.js';

const router: Router = express.Router();

/**
 * @swagger
 * /auth/signin:
 *   get:
 *     summary: Microsoft connection.
 *     description: Allows you to connect using your Microsoft account and redirects to /auth/token to retrieve the token.
*/

router.get('/signin', authProvider.login({
    scopes: ['User.Read'],
    redirectUri: REDIRECT_URI,
    successRedirect: '/auth/token'
}));

/**
 * @swagger
 * /auth/token:
 *   get:
 *     summary: Retrieve the token.
 *     description: Retrieve the token and becomes accessible from req.session.accessToken.
*/

async function createUser(userData: any): Promise<any> {
    let exist = dataBase.getRepository(User).createQueryBuilder('user').where('user.email = :email', { email: userData.userPrincipalName }).getOne();

    if (!exist) {
        const user = new User();
        user.email = userData.mail;
        user.token = userData.accessToken;
        user.role = false;
        const data = await dataBase.getRepository(User).save(user);
        console.log(data);
    }
};

router.get('/token', authProvider.acquireToken({
    scopes: ['User.Read'],
    redirectUri: REDIRECT_URI,
    successRedirect: '/',
    successCallback: (req: Request, res: Response) => {
        try {
            createUser(req.session.user);
            res.redirect('/');
        } catch (err) {
            res.status(500).json({ err: 'Error during retrieving the token' });
        }
    }
}));

/**
 * @swagger
 * /auth/redirect:
 *   post:
 *     summary: Redirect.
 *     description: Redirect.
*/

router.post('/redirect', authProvider.handleRedirect());

/**
 * @swagger
 * /auth/signout:
 *   get:
 *     summary: Microsoft logout.
 *     description: Logs you out of your Microsoft account.
*/

router.get('/signout', authProvider.logout({
    postLogoutRedirectUri: POST_LOGOUT_REDIRECT_URI
}));

export default router;
