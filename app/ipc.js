"use strict";
exports.__esModule = true;
var $ = require("jquery");
var IPC = (function () {
    function IPC(app) {
        var _this = this;
        this.requestSong = function (id, finished) {
            _this.urlExists(id, function (status) {
                if (!status) {
                    var saveData = $.ajax({
                        type: 'STREAM',
                        url: "/" + id,
                        dataType: "type",
                        success: function (resultData) {
                            finished(resultData);
                        }
                    });
                }
            });
        };
        this.urlExists = function (url, callback) {
            $.ajax({
                type: 'HEAD',
                url: url,
                success: function () {
                    callback(true);
                },
                error: function () {
                    callback(false);
                }
            });
        };
        this.app = app;
    }
    return IPC;
}());
exports.IPC = IPC;
