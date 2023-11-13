/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

var express = require('express');
var { GRAPH_ME_ENDPOINT } = require('../../config/authConfig');
const { user_connection } = require('./users.query');

var router = express.Router();

// custom middleware to check auth state
function isAuthenticated(req, res, next) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/auth/signin'); // redirect to sign-in route
    }
    next();
};

router.get('/id', isAuthenticated, async function (req, res, next) {
        res.render('id', { idTokenClaims: req.session.account.idTokenClaims });
    }
);

router.get('/profile', isAuthenticated, async function (req, res, next) {
        try {
            const graphResponse = await user_connection(GRAPH_ME_ENDPOINT, req.session.accessToken);
            res.render('profile', { profile: graphResponse });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;