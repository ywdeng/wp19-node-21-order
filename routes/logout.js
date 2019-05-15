var express = require('express');
var router = express.Router();
const rememberMe = require('../rememberMe');

router.get('/', function (req, res, next) {
    if (req.cookies && req.cookies.rememberMe) {
        rememberMe.clearCookie(res);
    }
    if (req.session) {
        // delete session
        req.session.destroy((err) => {
            if (err) return next(err);
            return res.redirect('/');
        });
    }
});

module.exports = router;