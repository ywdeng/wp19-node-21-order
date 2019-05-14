var express = require('express');
var router = express.Router();
var prodSpec = require("../models/product.json");

router.get('/', function (req, res, next) {
  res.render("menu", {
    title: "線上訂購飲料",
    prodList: prodSpec.products
  });
});

module.exports = router;
