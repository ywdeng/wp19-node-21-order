const baseClass = require('./dao');

/**
 * 帳號資料存取
 */
class UserDAO extends baseClass.DAO {
    constructor(filename) {
        super(filename);
    }

    /**
     * 將電話號碼轉換成 ID：只取數字，去除 ()-+，前置補 0，長度 10 碼
     * @param {*} tel 
     */
    tel2ID(tel) {
        var id = '';
        var n = tel.match(/\d+/g); // extract digits
        if (n) {
            id = Array.isArray(n) ? n.join('') : n;
        }
        if (id.length < 10) {
            id = "00000000000" + id;
        }
        id = id.substr(id.length - 10);
        return id;
    }

    /**
     * 驗證帳號密碼
     * @param {*} id 帳號
     * @param {*} passwd 密碼
     * @param {*} callback 後續處理函式
     */
    authenticate(id, passwd, callback) {
        var u = this.findByID(id);
        if (u && u.password && (u.password === passwd)) {
            return callback(null, u);
        }
        var err = new Error("帳號或密碼錯誤!");
        return callback(err);
    }
}

module.exports = new UserDAO("user.json");