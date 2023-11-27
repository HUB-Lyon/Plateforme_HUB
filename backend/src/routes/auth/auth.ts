/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import express from 'express';
import { Request, Response, Router } from 'express';

import authProvider from '../../auth/AuthProvider.js';
import { REDIRECT_URI, POST_LOGOUT_REDIRECT_URI } from '../../config/authConfig.js';

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

router.get('/token', authProvider.acquireToken({
    scopes: ['User.Read'],
    redirectUri: REDIRECT_URI,
    successRedirect: '/'
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
