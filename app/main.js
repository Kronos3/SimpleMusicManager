"use strict";
exports.__esModule = true;
var songcontroller_1 = require("./songcontroller");
var ipc_1 = require("./ipc");
var App = (function () {
    function App() {
        this.ipc = new ipc_1.IPC(this);
        this.songcontroller = new songcontroller_1.SongController(this, this.ipc);
    }
    return App;
}());
exports.App = App;
