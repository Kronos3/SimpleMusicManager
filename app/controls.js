"use strict";
exports.__esModule = true;
var controls = (function () {
    function controls(controller) {
        var _this = this;
        this.n_repeat = 0;
        this.n_shuffle = 0;
        this.n_play = 0;
        this.repeat = function () {
            if (_this.n_repeat != 2) {
                _this.n_repeat = _this.n_repeat + 1;
            }
            else {
                _this.n_repeat = 0;
            }
            if (_this.n_repeat == 0) {
                $("#repeat").css("color", "#424242");
                $("#repeat > i").text("repeat");
            }
            else if (_this.n_repeat == 1) {
                $("#repeat").css("color", "#ef5350");
                $("#repeat > i").text("repeat");
            }
            else if (_this.n_repeat == 2) {
                $("#repeat > i").text("repeat_one");
            }
        };
        this.shuffle = function () {
            if (_this.n_shuffle) {
                _this.n_shuffle = 0;
                $("#shuffle").css("color", "#424242");
            }
            else {
                _this.n_shuffle = 1;
                $("#shuffle").css("color", "#ef5350");
            }
        };
        this.play = function (__play) {
            if ($('#play').hasClass('disabled')) {
                $(_this.controller.currentSongDiv).children('.tbl-num').children('span').css('background-image', "url(''");
                return;
            }
            if (__play == undefined) {
                if (_this.n_play === 0) {
                    _this.n_play = 1;
                    $("#play > i").text("pause");
                    _this.controller.audio.play();
                    $(_this.controller.currentSongDiv).children('.tbl-num').children('.song-number').css('color', 'rgba(255,255,255,0)');
                    $(_this.controller.currentSongDiv).children('.tbl-num').children('span').css('background-image', "url('img/playing.gif')");
                }
                else {
                    _this.n_play = 0;
                    $("#play > i").text("play_arrow");
                    _this.controller.audio.pause();
                    $(_this.controller.currentSongDiv).children('.tbl-num').children('.song-number').css('color', 'rgba(255,255,255,0)');
                    $(_this.controller.currentSongDiv).children('.tbl-num').children('span').css('background-image', "url('img/paused.png')");
                }
                $('#play').toggleClass("paused");
            }
            else if (__play) {
                _this.n_play = 1;
                $("#play > i").text("pause");
                _this.controller.audio.play();
                $(_this.controller.currentSongDiv).children('.tbl-num').children('.song-number').css('color', 'rgba(255,255,255,0)');
                $(_this.controller.currentSongDiv).children('.tbl-num').children('span').css('background-image', "url('img/playing.gif')");
                $('#play').removeClass("paused");
            }
            else if (!__play) {
                _this.n_play = 0;
                $("#play > i").text("play_arrow");
                _this.controller.audio.pause();
                $(_this.controller.currentSongDiv).children('.tbl-num').children('.song-number').css('color', 'rgba(255,255,255,0)');
                $(_this.controller.currentSongDiv).children('.tbl-num').children('span').css('background-image', "url('img/paused.png')");
            }
        };
        this.controller = controller;
    }
    return controls;
}());
exports.controls = controls;
