/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import express from 'express';
import { Request, Response, NextFunction } from 'express';
import { GRAPH_ME_ENDPOINT } from '../../config/authConfig.js';
import { userConnection } from './users.query.js';

declare module 'express' {
    interface Request {
        session: any;
    }
}

const router = express.Router();

function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
    if (!req.session.isAuthenticated) {
        return res.redirect('/auth/signin');
    }
    next();
}

router.get('/profile', isAuthenticated, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.json(await userConnection(GRAPH_ME_ENDPOINT, req.session.accessToken));
    } catch (error) {
        next(error);
    }
});

export default router;
