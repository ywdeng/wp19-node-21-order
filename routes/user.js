var express = require('express');
var router = express.Router();
const userDAO = require('../models/userDAO');

/* Create new user */
router.get('/new', function (req, res, next) {
    var pageAfterLogin = false;
    var user = false;
    if (req.session) {
        if (req.session.newUser) {
            user = req.session.newUser;
        }
        if (req.session.pageAfterLogin) {
            pageAfterLogin = req.session.pageAfterLogin;
        }
        req.session.destroy((err) => {
            if (err) console.log(err);
        });
    }
    var viewbag = {
        pageAfterLogin: pageAfterLogin,
        account: (user ? user.id : false),
        name: (user ? user.name : false),
        tel: (user ? user.tel : false),
        addr: (user ? user.addr : false)
    };
    res.render('createUser', viewbag);
});

/* Create new user */
router.post('/', function (req, res, next) {
    var user = {
        id: req.body.account,
        name: req.body.custName,
        tel: req.body.tel,
        addr: req.body.addr,
        password: req.body.passwd,
        isAdmin: false
    };
    userDAO.append(user);
    req.session.user = user;
    if (req.body.pageAfterLogin) {
        return res.redirect(req.body.pageAfterLogin);
    } else {
        res.redirect("/");
    }
});

module.exports = router;
