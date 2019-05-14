function unitSum(priceId, amountId, sumId) {
    var p = document.getElementById(priceId);
    var a = document.getElementById(amountId);
    var s = document.getElementById(sumId);
    s.value = Number(p.value) * Number(a.value);
}
function unitPrice(price, priceId, amountId, sumId) {
    var x = document.getElementById(priceId);
    x.value = price;
    unitSum(priceId, amountId, sumId);
}