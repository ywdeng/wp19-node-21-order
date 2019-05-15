const express = require('express');
const router = express.Router();
const userDAO = require('../models/userDAO');
const rememberMe = require('../rememberMe');

router.get('/', function (req, res, next) {
    var pageAfterLogin = false;
    var user = false;
    if (req.session) {
        if (req.session.pageAfterLogin) {
            pageAfterLogin = req.session.pageAfterLogin;
        }
        if (req.session.loginUser) {
            user = req.session.loginUser;
        }
        req.session.destroy((err) => {
            if (err) console.log(err);
        });
    }
    var viewbag = { pageAfterLogin: pageAfterLogin, account: (user ? user.id : false) };
    res.render('login', viewbag);
});

router.post('/', function (req, res, next) {
    if (req.body.account && req.body.passwd) {
        userDAO.authenticate(req.body.account, req.body.passwd, (err, user) => {
            if (err) {
                var viewbag = { account: req.body.account, errMsg: err.message + "，請重新登入：" };
                if (req.body.pageAfterLogin) {
                    viewbag.pageAfterLogin = req.body.pageAfterLogin;
                }
                return res.render('login', viewbag);
            } else {
                req.session.user = user;
                if (req.body.rememberMe) {
                    rememberMe.setCookie(res, 'rememberMe', user.id);
                }
                if (req.body.pageAfterLogin) {
                    res.redirect(req.body.pageAfterLogin);
                } else {
                    res.redirect("/");
                }
            }
        });
    } else {
        res.render('/login');
    }
});

module.exports = router;