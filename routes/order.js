var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var orderDAO = require('../models/orderDAO');
var userDAO = require('../models/userDAO');
var prodSpec = require("../models/product.json");

// 列出所有的訂單
router.get('/', function (req, res, next) {
    if (req.session && req.session.user) {
        var viewbag = { user: req.session.user };
        var list = (viewbag.user.isAdmin) ? orderDAO.loadAll() : orderDAO.findByUserId(viewbag.user.id);
        if (list && (list.length > 0)) {
            // 排序，從新到舊
            list.sort((x, y) => y.id - x.id);

            // 計算每一張訂單的總杯數
            list.forEach(x => {
                var qty = 0;
                x.items.forEach(m => {
                    qty += Number(m.qty);
                });
                x.qty = qty; // 總共幾杯
            });
            viewbag.orders = list;
        } else {
            viewbag.orders = false;
        }
        res.render("order", viewbag);
    } else {
        res.redirect('/login');
    }
});

// 顯示指定的訂單 
router.get('/:id', function (req, res, next) {
    var item = orderDAO.findByID(req.params.id);
    if (item && item.id) {
        var viewbag = { order: item };
        if (req.session && req.session.user) {
            viewbag.user = req.session.user;
        }
        return res.render("orderDetail", viewbag);
    } else {
        next(createError(404));
    }
});

function createOrder(req) {
    var list = [];
    var total = 0;
    for (var i = 0; i < prodSpec.products.length; i++) {
        var id = prodSpec.products[i].id;
        var item = {};
        if (req.body[id + "Sum"] > 0) {
            item.name = prodSpec.products[i].name;
            item.size = "小杯(S)";
            if (req.body[id + "Size"] == "M") {
                item.size = "中杯(M)"
            } else if (req.body[id + "Size"] == "L") {
                item.size = "大杯(L)";
            } else if (req.body[id + "Size"] == "XL") {
                item.size = "特大杯(XL)";
            }
            item.price = Number(req.body[id + "Price"]);
            item.qty = Number(req.body[id + "Qty"]);
            item.sum = Number(req.body[id + "Sum"]);
            total += item.sum;
            item.note = "";
            if (req.body[id + "Ice"] == "1")
                item.note = "少冰 ";
            else if (req.body[id + "Ice"] == "2")
                item.note = "去冰 ";

            if (req.body[id + "Sugar"] == "1")
                item.note += "減糖";
            else if (req.body[id + "Sugar"] == "2")
                item.note += "微糖";
            else if (req.body[id + "Sugar"] == "3")
                item.note += "無糖";

            if (item.note == "") item.note = "正常";

            list.push(item);
        }
    }
    var now = new Date();
    var ordr = {
        custName: req.body.custName,
        custTel: req.body.custTel,
        custAddr: req.body.custAddr,
        items: list,
        total: total,
        orderDate: now.toLocaleString('zh-Tw', { timeZone: 'Asia/Taipei' })
    };
    return ordr;
}

// 建立新訂單
router.post("/", function (req, res, next) {
    var order = createOrder(req);
    if (req.session && req.session.user) {
        // user place order after login
        order.userId = req.session.user.id;
        var id = orderDAO.append(order);
        res.redirect("/order/" + id);
    } else {
        order.userId = userDAO.tel2ID(order.custTel); // 電話號碼就是帳號
        var id = orderDAO.append(order);
        var user = userDAO.findByID(order.userId);
        req.session.pageAfterLogin = "/order/" + id;
        if (user && user.id) {
            // 請舊用戶登入
            req.session.loginUser = user;
            res.redirect('/login');
        } else {
            // 建立新帳號
            req.session.newUser = { id: order.userId, name: order.custName, tel: order.custTel, addr: order.custAddr, isAdmin: false };
            res.redirect('/user/new');
        }
    }
});


module.exports = router;
