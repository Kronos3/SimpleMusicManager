"use strict";
exports.__esModule = true;
var $ = require("jquery");
var Song = (function () {
    function Song(controller, e) {
        this.play = function () {
        };
        this.object = e;
        this.controller = controller;
        this.metaObj = this.controller.findSongFromEl(this.object);
        this.name = this.metaObj.title;
        this.artist = this.metaObj.artist;
        this.album = this.metaObj.album;
    }
    return Song;
}());
exports.Song = Song;
function initConfig() {
    return {
        cacheStream: false,
        cacheMeta: true,
        cachePath: '.cache',
        songPath: '~/Music/SMM'
    };
}
var controls = (function () {
    function controls() {
    }
    return controls;
}());
var SongController = (function () {
    function SongController(app, ipc) {
        var _this = this;
        this.findSongIndexFromEl = function (el) {
            return (_this.findSongIndex($(el).data('id'), "id"));
        };
        this.findSongFromEl = function (el) {
            return (_this.metaSongs[_this.findSongIndexFromEl(el)]);
        };
        this.findSongIndex = function (attr, token) {
            for (var i = 0; i != _this.metaSongs.length; i++) {
                if (_this.metaSongs[i][attr] == token) {
                    return i;
                }
            }
        };
        this.findSong = function (attr, token) {
            return _this.metaSongs[_this.findSongIndex(attr, token)];
        };
        this.setSong = function (url) {
            _this.audio.src = url;
        };
        this.playSong = function (el) {
            _this.currentSong = _this.findSongFromEl(el);
            _this.ipc.requestSong(_this.currentSong.id, function (url) {
                _this.setSong(url);
            });
        };
        this.audio = new Audio;
        this.app = app;
        this.ipc = ipc;
        this.config = initConfig();
        $('.tooltipped').tooltip({ delay: 2000 });
        document.querySelector('#song-time').addEventListener('immediate-value-change', function (e) {
            _this.songTimeChanging = true;
        });
        document.querySelector('#song-time').addEventListener('change', function (e) {
            ;
            this.audio.currentTime = document.querySelector('#song-time').value;
            this.songTimeChanging = false;
        });
        document.querySelector('#song-vol').addEventListener('immediate-value-change', function (e) {
            ;
            this.audio.volume = (document.querySelector('#song-vol').immediateValue / 100);
        });
        document.querySelector('#song-vol').addEventListener('change', function (e) {
            this.audio.volume = (document.querySelector('#song-vol').value / 100);
        });
    }
    SongController.prototype.generateQueue = function (e) {
    };
    return SongController;
}());
exports.SongController = SongController;
