var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var orderDAO = require('../models/orderDAO');
var prodSpec = require("../models/product.json");

// 列出所有的訂單
router.get('/', function (req, res, next) {
    var list = orderDAO.loadAll();
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
        res.render("order", {
            title: "訂購清單",
            orders: list
        });
    } else {
        res.send("<h1 style='text-align:center;color:red;margin:2em'>沒有訂單</h1>");
    }
});

// 顯示指定的訂單 
router.get('/:id', function (req, res, next) {
    var item = orderDAO.load(req.params.id);
    if (item && item.id) {
        res.render("orderDetail", {
            title: "客戶訂單",
            order: item
        });
    } else {
        next(createError(404));
    }
});

// 建立新訂單
router.post("/", function (req, res) {
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
    var id = orderDAO.append({
        custName: req.body.custName,
        custTel: req.body.custTel,
        custAddr: req.body.custAddr,
        items: list,
        total: total,
        orderDate: now.toLocaleString('zh-Tw', { timeZone: 'Asia/Taipei' })
    });

    res.redirect("/order/" + id);
});


module.exports = router;
