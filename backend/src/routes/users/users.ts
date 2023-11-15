/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { GRAPH_ME_ENDPOINT } from '../../config/authConfig.js';
import { user_connection } from './users.query.js';

declare module 'express' {
    interface Request {
        session: any;
    }
}

const router = express.Router();

// Custom middleware to check authentication state
function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
    if (!req.session.isAuthenticated) {
        return res.redirect('/auth/signin'); // Redirect to the sign-in route
    }
    next();
}

router.get('/id', isAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    res.render('id', { idTokenClaims: req.session.account.idTokenClaims });
});

router.get('/profile', isAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const graphResponse = await user_connection(GRAPH_ME_ENDPOINT, req.session.accessToken);
        res.render('profile', { profile: graphResponse });
    } catch (error) {
        next(error);
    }
});

export default router;
