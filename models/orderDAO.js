var fs = require('fs');
var path = require('path');

/**
 * 訂單資料存取
 */
class OrderDAO {
    /**
     * Readonly Property: orders data file 
     */
    get dataFile() {
        return path.join(__dirname, "order.json");
    }

    /**
     * 載入全部的訂單
     */
    loadAll() {
        // 注意！不可使用非同步的 fs.ReadFile()
        var text = fs.readFileSync(this.dataFile, 'utf8');
        var data = text.trim();
        if (data) {
            var obj = JSON.parse(data); // 字串轉物件
            return obj;
        }
        return []; // 沒有資料，回傳空陣列
    }

    /**
     * 載入指定 id 的訂單
     * @param {int} id  
     */
    load(id) {
        var list = this.loadAll();
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == id) return list[i];
        }
        return {}; // 找不到，回傳空物件
    }

    /**
     * 儲存全部的訂單
     * @param {*} obj 
     */
    store(obj) {
        var json = JSON.stringify(obj); //convert it back to json
        fs.writeFile(this.dataFile, json, 'utf8', (err) => {
            if (err) throw err;
            console.log(this.dataFile + ' has been saved.');
        }); // write it back 
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
        this.store(list);
        // 回傳最後一張訂單的 id
        return list[list.length - 1].id;
    }
}

module.exports = new OrderDAO();