'use strict';

// This will return a JWT regardles of usernam or password.
// Only for testing
module.exports = (req, res, next) => {
    if (req.method === 'POST' && req.url === '/login/') {
        var username = req.body.username;

        // The allowable users are admin and test
        // No password is required in the testing env
        if (username == 'admin' || username == 'test') {
            // If the username is admin, then set admin to true
            var isAdmin = username === 'admin' ? true : false;

            // Create a JWT token
            var token = "this is my dummy token";

            // send the JWT back
            res.json({
                token: token
            });
        } else {
            res.status(401).send('None shall pass !!!!!');
        }
    } else {
        next();
    }
};