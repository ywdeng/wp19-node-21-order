var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var viewbag = {};
  viewbag.title = "網路飲料店";
  if (req.session && req.session.user) {
    viewbag.user = req.session.user;
  }
  res.render('index', viewbag);
});

module.exports = router;
