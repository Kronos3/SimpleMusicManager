"use strict";
exports.__esModule = true;
var IPC = (function () {
    function IPC(app) {
        this.requestSong = function (id, _context, finished) {
            var saveData = $.ajax({
                type: 'STREAM',
                url: "/" + id,
                success: function (resultData) {
                    finished(resultData, _context);
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
        this.check_oauth = function (callback) {
            $.ajax({
                type: "CHECKOAUTH",
                url: "/",
                success: function () {
                    callback(true);
                },
                error: function () {
                    callback(false);
                }
            });
        };
        this.increment_song = function (id, callback) {
            if (callback === void 0) { callback = function () { return; }; }
            $.ajax({
                type: "INC",
                url: "/{0}".format(id),
                success: function () {
                    callback();
                },
                error: function () {
                    callback();
                }
            });
        };
        this.app = app;
    }
    return IPC;
}());
exports.IPC = IPC;
