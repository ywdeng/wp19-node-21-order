const baseClass = require('./dao');

/**
 * 訂單資料存取
 */
class OrderDAO extends baseClass.DAO {
    constructor(filename) {
        super(filename);
    }

    /**
     * 新增訂單
     * Returns the id of the latest Order or -1 if err
     * @param {*} obj 
     */
    append(obj) {
        if (!obj) return -1; // 出錯，回傳 -1
        var list = this.loadAll();
        var nextId = 1; // 下一張訂單的 id
        if (list.length > 0) {
            // 排序，從舊到新
            list.sort((x, y) => {
                return x.id - y.id;
            });
            nextId = list[list.length - 1].id + 1;
        }
        if (Array.isArray(obj)) {
            // 輸入是陣列：一次新增多張訂單
            for (var i = 0; i < obj.length; i++) {
                obj[i].id = nextId + i;
                list.push(obj[i]);
            }
        } else {
            // 輸入只有一張訂單
            obj.id = nextId;
            list.push(obj);
        }
        // 全部儲存
        this.storeAll(list);
        // 回傳最後一張訂單的 id
        return list[list.length - 1].id;
    }
}

module.exports = new OrderDAO("order.json");