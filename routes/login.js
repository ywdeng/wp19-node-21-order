const express = require('express');
const router = express.Router();
const userDAO = require('../models/userDAO');

router.get('/', function (req, res, next) {
    if (req.session) {
        // delete session if any
        req.session.destroy((err) => {
            if (err) console.log(err);
        });
    }
    res.render('login');
});

router.post('/', function (req, res, next) {
    if (req.body.id && req.body.passwd) {
        userDAO.authenticate(req.body.id, req.body.passwd, (err, user) => {
            if (err) {
                return res.render('login', {
                    account: req.body.id,
                    errMsg: err.message
                });
            } else {
                req.session.user = user;
                if (req.session.previousPage) {
                    res.redirect(req.session.previousPage);
                }
                res.redirect("/");
            }
        });
    } else {
        res.render('/login', {
            account: '',
            errMsg: ''
        });
    }
});

module.exports = router;