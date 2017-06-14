"use strict";
exports.__esModule = true;
var songcontroller_1 = require("./songcontroller");
var ui_1 = require("./ui");
var ipc_1 = require("./ipc");
var App = (function () {
    function App() {
        this.ipc = new ipc_1.IPC(this);
        this.songcontroller = new songcontroller_1.SongController(this, this.ipc);
        this.ui = new ui_1.UI(this);
    }
    return App;
}());
exports.App = App;
window.APP = null;
$(document).ready(function () {
    window.APP = new App();
});
