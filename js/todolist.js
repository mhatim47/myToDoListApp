export default class ToDoList {
    constructor() {
        this._list = [];
    }

    getList() {
        return this._list;
    }

    addItem(item) {
        this._list.push(item);
    }

    clearList() {
        this._list = [];
    }

    removeItem(id) {
        const list = this._list;
        for (let i= 0 ; i < list.length; i++) {
            if (list[i]._id == id) {
                list.splice(i,1);
                break;
            }
        }
    }
}