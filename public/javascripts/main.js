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

function validatePassword(txtPwd1Id, txtPwd2Id, btnOkId) {
    var txtPwd1 = document.getElementById(txtPwd1Id);
    var txtPwd2 = document.getElementById(txtPwd2Id);
    var btnOk = document.getElementById(btnOkId);
    btnOk.disabled = true;
    btnOk.title = "請完成密碼設定";
    var pwd1 = String(txtPwd1.value).trim();
    var pwd2 = String(txtPwd2.value).trim();
    if (pwd1.length < 6) {
        txtPwd1.value = '';
        alert('密碼至少6碼，不可空格！');
        txtPwd1.focus();
        return;
    }
    if (pwd1 != pwd2) {
        if (pwd2.length < 1) {
            txtPwd2.focus();
            return;
        }
        txtPwd2.value = '';
        alert('兩次輸入的密碼不一致！');
        txtPwd2.focus();
        return;
    }
    btnOk.disabled = false;
    btnOk.title = "";
}