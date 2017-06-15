"use strict";
exports.__esModule = true;
var UTIL = require("./util");
var controls_1 = require("./controls");
var Mustache = require("mustache");
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
        this.genMetaFromRaw = function (struct) {
            _this.metaSongs = [];
            struct.songs.forEach(function (song) {
                _this.metaSongs.push(song);
            });
        };
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
                _this.ipc.requestSong(_this.currentSong.id, _this, function (url, __this) {
                    __this.setSong(url);
                    __this.audio.currentTime = document.querySelector('#song-time').value;
                    __this.controls.play(true);
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
            return (_this.findSongIndexID($(el).data('id')));
        };
        this.findSongFromEl = function (el) {
            return (_this.metaSongs[_this.findSongIndexFromEl(el)]);
        };
        this.findSongIndexID = function (token) {
            for (var i = 0; i != _this.metaSongs.length; i++) {
                if (_this.metaSongs[i].id == token) {
                    return i;
                }
            }
        };
        this.setSong = function (url) {
            _this.audio.src = url;
        };
        this.songClick = function (el) {
            _this.generateQueue(el);
            _this.audio.currentTime = 0;
            _this.playSong(_this.findSongFromEl(el));
        };
        this.findSonginEl = function (id, ar) {
            for (var i = 0; i != ar.length; i++) {
                if ($(ar[i]).data('id') == id) {
                    return ar[i];
                }
            }
            return null;
        };
        this.findSongIndexinEl = function (id, ar) {
            for (var i = 0; i != ar.length; i++) {
                if ($(ar[i]).data('id') == id) {
                    return i;
                }
            }
            return -1;
        };
        this.playSong = function (song) {
            $('#play').removeClass('disabled');
            $('#back').removeClass('disabled');
            $('#skip').removeClass('disabled');
            if (_this.currentSongDiv != undefined)
                $(_this.currentSongDiv).children('.tbl-num').children('span').css('background-image', 'url({0})'.format(_this.currentSong.albumArtRef[0].url));
            _this.currentSongIndex = UTIL.find(song, _this.metaSongs);
            _this.audio.currentTime = 0;
            _this.currentSong = _this.metaSongs[_this.currentSongIndex];
            _this.currentSongDiv = _this.findSonginEl(_this.currentSong.id, _this.queueEl);
            _this.queueIndex = _this.findSongIndexinEl(_this.currentSong.id, _this.queueEl);
            _this.parseInfo();
            _this.ipc.requestSong(_this.currentSong.id, _this, function (url, __this) {
                __this.setSong(url);
                __this.increment_song();
                __this.controls.play(true);
            });
        };
        this.nextSong = function () {
            if ($('#next').hasClass('disabled')) {
                return;
            }
            var n; // Buffer for queue index pointing to next song
            if (_this.controls.n_repeat == 0) {
                if (_this.controls.n_shuffle == 1) {
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
        this.prevSong = function () {
            if ($('#back').hasClass('disabled')) {
                return;
            }
            console.log(_this.audio.currentTime);
            if (_this.audio.currentTime > 5) {
                _this.audio.currentTime = 0;
            }
            else {
                var n = _this.queueIndex - 1;
                if (n < 0) {
                    n = 0;
                }
                _this.playSong(_this.queue[n]);
            }
        };
        this.parseInfo = function () {
            $.get('templates/songinfo.mst', function (template) {
                var rendered = Mustache.render(template, _this.currentSong);
                $('#song-info-template').html(rendered);
            });
            $('#song-time').css('display', 'block');
        };
        this.increment_song = function () {
            _this.ipc.increment_song(_this.currentSong.id);
            $(_this.currentSongDiv).children('.tbl-plays').text(parseInt($(_this.currentSongDiv).children('.tbl-plays').text()) + 1);
        };
        this.audio = new Audio;
        this.audio.volume = 0.5;
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
            _this.audio.currentTime = document.querySelector('#song-time').value;
            _this.songTimeChanging = false;
        });
        document.querySelector('#song-vol').addEventListener('immediate-value-change', function (e) {
            ;
            _this.audio.volume = (document.querySelector('#song-vol').immediateValue / 100);
        });
        document.querySelector('#song-vol').addEventListener('change', function (e) {
            _this.audio.volume = (document.querySelector('#song-vol').value / 100);
        });
        this.queue = [];
        this.queueEl = [];
        this.initAudioEvents();
    }
    SongController.prototype.generateQueue = function (e) {
        var _this = this;
        $(e).parent().children('.____song-list').toArray().forEach(function (element) {
            _this.queue.push(_this.findSongFromEl(element));
            _this.queueEl.push(element);
        });
    };
    return SongController;
}());
exports.SongController = SongController;
