const path = require('path');
const fs = require('fs');

class DAO {
    constructor(filename) {
        this.filename = filename;
    }

    get dataFile() {
        return path.join(__dirname, this.filename);
    }

    /**
     * 全部載入
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
     * 全部儲存
     * @param {*} obj 
     */
    storeAll(obj) {
        var json = JSON.stringify(obj); //convert it back to json
        fs.writeFile(this.dataFile, json, 'utf8', (err) => {
            if (err) throw err;
            console.log(this.dataFile + ' has been saved successfully.');
        }); // write it back 
    }

    /**
     * 載入指定 id 的訂單
     * @param {int} id  
     */
    findByID(id) {
        var list = this.loadAll();
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == id) return list[i];
        }
        return {}; // 找不到，回傳空物件
    }
}

module.exports.DAO = DAO;