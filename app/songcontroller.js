"use strict";
exports.__esModule = true;
var UTIL = require("./util");
var controls_1 = require("./controls");
function initConfig() {
    return {
        cacheStream: false,
        cacheMeta: true,
        cachePath: '.cache',
        songPath: '~/Music/SMM'
    };
}
var SongController = (function () {
    function SongController(app, ipc) {
        var _this = this;
        this.initAudioEvents = function () {
            _this.audio.addEventListener('progress', function () {
                // this = this.audio
                try {
                    var bufferedEnd = this.buffered.end(this.buffered.length - 1);
                }
                catch (err) {
                    bufferedEnd = document.querySelector('#song-time').secondaryProgress;
                }
                var duration = this.duration;
                document.querySelector('#song-time').secondaryProgress = bufferedEnd;
            });
            _this.audio.addEventListener('error', function () {
                _this.ipc.requestSong(_this.currentSong.id, function (url) {
                    _this.setSong(url);
                    _this.audio.currentTime = document.querySelector('#song-time').value;
                    _this.controls.play(true);
                });
            });
            _this.audio.addEventListener('timeupdate', function () {
                var duration = _this.audio.duration;
                try {
                    document.querySelector('#song-time').max = duration;
                }
                catch (err) {
                    ;
                }
                if (duration > 0) {
                    if (!_this.songTimeChanging) {
                        document.querySelector('#song-time').value = _this.audio.currentTime;
                    }
                }
            });
            _this.audio.onended = function () {
                _this.nextSong();
            };
        };
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
        this.songClick = function (el) {
            _this.generateQueue(el);
            _this.playSong(_this.findSongFromEl(el));
        };
        this.findSonginEl = function (id, ar) {
            ar.forEach(function (element) {
                if ($(element).data('id') == id) {
                    return element;
                }
            });
            return null;
        };
        this.playSong = function (song) {
            _this.currentSongIndex = UTIL.find(song, _this.metaSongs);
            _this.currentSong = _this.metaSongs[_this.currentSongIndex];
            _this.currentSongDiv = _this.findSonginEl(_this.currentSong.id, _this.queueEl);
            _this.ipc.requestSong(_this.currentSong.id, function (url) {
                _this.setSong(url);
                _this.queueIndex = UTIL.find(_this.currentSongDiv, _this.queue);
                _this.increment_song();
            });
        };
        this.nextSong = function () {
            if ($('#next').hasClass('disabled')) {
                return;
            }
            var n; // Buffer for queue index pointing to next song
            if (!_this.controls.n_repeat) {
                if (_this.controls.n_shuffle) {
                    n = Math.floor((Math.random() * _this.queue.length) + 0);
                }
                else {
                    n = _this.queueIndex + 1;
                }
                if ($(_this.queueEl[n]).height() == null) {
                    $('#song-info-template').html('');
                    $('#song-time').css('display', 'none');
                    _this.controls.play(false);
                    $('#play').addClass('disabled');
                    $('#skip').addClass('disabled');
                    $('#back').addClass('disabled');
                    return;
                }
            }
            else if (_this.controls.n_repeat == 1) {
                if (_this.controls.n_shuffle == 1) {
                    n = Math.floor((Math.random() * _this.queue.length) + 0);
                }
                else {
                    n = _this.queueIndex + 1;
                }
                if ($(_this.queueEl[n]).height() == null) {
                    n = 0;
                }
            }
            else if (_this.controls.n_repeat == 2) {
                n = _this.queueIndex;
            }
            _this.playSong(_this.queue[n]);
        };
        this.increment_song = function () {
            _this.ipc.increment_song(_this.currentSong.id);
        };
        this.audio = new Audio;
        this.app = app;
        this.ipc = ipc;
        this.config = initConfig();
        this.controls = new controls_1.controls(this);
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
        this.initAudioEvents();
    }
    SongController.prototype.generateQueue = function (e) {
        var _this = this;
        $(e).parent().children('.song-list').forEach(function (element) {
            _this.queue.push(_this.findSongFromEl(element.get(0)));
            _this.queueEl.push(element);
        });
    };
    return SongController;
}());
exports.SongController = SongController;
