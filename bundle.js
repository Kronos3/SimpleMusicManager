(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
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

},{}],3:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var GPSLogin = (function () {
    function GPSLogin(app) {
        var _this = this;
        this.updateStatus = function (callback, refresh) {
            var saveData = $.ajax({
                type: 'POST',
                url: "/check_login",
                dataType: "text",
                success: function (resultData) {
                    _this.close();
                    $('#sign-in').css('display', 'none');
                    _this.loginStatus = true;
                    if (typeof callback != 'undefined') {
                        callback(true);
                    }
                    if (refresh) {
                        _this.app.ui.refresh();
                    }
                },
                error: function () {
                    _this.loginStatus = false;
                    if (typeof callback != 'undefined') {
                        callback(false);
                    }
                }
            });
        };
        this.login = function () {
            _this.updateStatus(function (status) {
                if (!status) {
                    $('.login').css('display', 'block');
                    $('.disable').css('display', 'block');
                    $('.disable').css('z-index', '104');
                }
            });
        };
        this.close = function () {
            $('.login').css('display', 'none');
            $('.disable').css('display', 'none');
            $('.disable').css('z-index', '-1');
        };
        this.loginRedirect = function (url) {
            if (url != "http://localhost:8001/oauth/") {
                _this.close();
                $('#sign-in').css('display', 'none');
                _this.loginStatus = true;
                _this.app.ui.refresh();
            }
        };
        this.loginStatus = false;
        this.app = app;
    }
    return GPSLogin;
}());
var oauthLogin = (function () {
    function oauthLogin() {
        var _this = this;
        this.updateStatus = function () {
            $.ajax({
                type: 'CHECKOAUTH',
                url: '/',
                success: function () {
                    _this.loginStatus = true;
                },
                error: function () {
                    _this.perform();
                    _this.loginStatus = false;
                }
            });
        };
        this.perform = function () {
            $.ajax({
                type: 'GETOAUTHURL',
                url: '/',
                success: function (data) {
                    console.log(data);
                    window.open(data);
                }
            });
        };
        this.loginStatus = false;
    }
    return oauthLogin;
}());
var Login = (function () {
    function Login(app) {
        this.app = app;
        this.gps = new GPSLogin(this.app);
        this.oauth = new oauthLogin();
        this.gps.updateStatus(function () { return; }, true);
        this.oauth.updateStatus();
    }
    return Login;
}());
exports.Login = Login;

},{}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var songcontroller_1 = require("./songcontroller");
var ui_1 = require("./ui");
var ipc_1 = require("./ipc");
var login_1 = require("./login");
var App = (function () {
    function App() {
        this.ipc = new ipc_1.IPC(this);
        this.songcontroller = new songcontroller_1.SongController(this, this.ipc);
        this.ui = new ui_1.UI(this);
        this.login = new login_1.Login(this);
    }
    return App;
}());
exports.App = App;
window.APP = null;
$(document).ready(function () {
    window.APP = new App();
});

},{"./ipc":2,"./login":3,"./songcontroller":5,"./ui":7}],5:[function(require,module,exports){
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

},{"./controls":1,"./util":8}],6:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Tabs = (function () {
    function Tabs(app, ui) {
        var _this = this;
        this.dis_0 = function () {
            $('.topcontent-wrapper').css('transform', 'translateX(-0)');
            $('.other-buff').css('display', 'none');
            $('.topcontent-wrapper').css('display', 'flex');
            _this.ui.switch_top('red', 'none');
            _this.current = 0;
        };
        this.dis_1 = function () {
            $('.topcontent-wrapper').css('transform', 'translateX(-100vw)');
            $('.other-buff').css('display', 'none');
            $('.topcontent-wrapper').css('display', 'flex');
            _this.ui.switch_top('red', 'none');
            _this.current = 1;
        };
        this.dis_2 = function () {
            $('.topcontent-wrapper').css('transform', 'translateX(-200vw)');
            $('.other-buff').css('display', 'none');
            $('.topcontent-wrapper').css('display', 'flex');
            _this.ui.switch_top('red', 'none');
            _this.current = 2;
        };
        this.dis_3 = function () {
            $('.topcontent-wrapper').css('transform', 'translateX(-300vw)');
            $('.other-buff').css('display', 'none');
            $('.topcontent-wrapper').css('display', 'flex');
            _this.ui.switch_top('red', 'none');
            _this.current = 3;
        };
        this.app = app;
        this.current = 0;
        this.ui = ui;
    }
    return Tabs;
}());
exports.Tabs = Tabs;

},{}],7:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var tabs_1 = require("./tabs");
var Mustache = require("mustache");
var UI = (function () {
    function UI(app) {
        var _this = this;
        this.get = function (s) {
            return document.querySelector(s);
        };
        this.scrolled = function () {
            if ($(".other-buff > .album").position() == undefined || _this.in_songs) {
                return;
            }
            if ($('.other-buff > .album').hasClass('playlist-wrapper')) {
                return;
            }
            var elmnt = document.querySelector(".other-buff");
            var x = elmnt.scrollLeft;
            var y = elmnt.scrollTop;
            if (y >= ($(".other-buff > .album").position().top)) {
                _this.switch_top('red', '');
            }
            else if (y == (elmnt.scrollHeight - elmnt.offsetHeight)) {
                _this.switch_top('red', '');
            }
            else {
                _this.switch_top('clear', '');
            }
        };
        this.switch_top = function (t, artist_img) {
            if (artist_img === void 0) { artist_img = undefined; }
            if (t == "red") {
                if (artist_img == "none") {
                    $('.window').css('background-image', "");
                }
                else if (artist_img != '') {
                    $('.window').css('background-image', "url(" + artist_img + ")");
                }
                $('#menu').removeClass('with-back');
                $('#menu').removeClass('white');
                $('#menu').addClass('red');
                $('.window').addClass('z-depth-5');
                $('.top-bar').removeClass('with-back');
                $('.top-bar').removeClass('white');
                $('.top-bar').addClass('red');
                $('#search-color').removeClass('with-back');
                $('#search-color').removeClass('white');
                $('#search-color').addClass('red');
                $('.home-wrapper').css('opacity', '1');
            }
            else if (t == "clear") {
                if (artist_img != '') {
                    $('.window').css('background-image', "url(" + artist_img + ")");
                }
                $('#menu').removeClass('red');
                $('#menu').addClass('white');
                $('#menu').addClass('with-back');
                $('.window').removeClass('z-depth-5');
                $('.top-bar').removeClass('red');
                $('.top-bar').addClass('white');
                $('.top-bar').addClass('with-back');
                $('#search-color').removeClass('red');
                $('#search-color').addClass('white');
                $('#search-color').addClass('with-back');
                $('.home-wrapper').css('opacity', '0');
            }
        };
        this.goto_album = function (album) {
            $.get('templates/album.mst', function (template) {
                album.songs.sort(function (a, b) {
                    return a.trackNumber - b.trackNumber;
                });
                var max_top;
                var rendered = Mustache.render(template, album);
                $('.other-buff').html(rendered);
                $('.other-buff').css('display', 'block');
                $('.topcontent-wrapper').css('display', 'none');
                /*document.getElementById('al').scrollIntoView();*/
                $(".other-buff").scrollTop($("#al").position().top);
                $('.song-row').contextmenu(function (event) {
                    max_top = $(window).height() - 90 - 230;
                    if (event.pageY > max_top) {
                        $('.song-row-menu').css({
                            bottom: ($(window).height() - event.pageY - 15) + "px",
                            top: 'initial',
                            left: event.pageX + "px",
                            display: "block"
                        });
                    }
                    else {
                        $('.song-row-menu').css({
                            top: event.pageY + "px",
                            left: event.pageX + "px",
                            bottom: 'initial',
                            display: "block"
                        });
                    }
                });
            });
            _this.switch_top("clear", album.artimg);
        };
        this.goto_artist = function (artist) {
            $.get('templates/artist.mst', function (template) {
                for (var i = 0; i != artist.albums.length; i++) {
                    artist.albums[i].songs.sort(function (a, b) {
                        return a.trackNumber - b.trackNumber;
                    });
                }
                var max_top;
                var rendered = Mustache.render(template, artist);
                $('.other-buff').html(rendered);
                $('.other-buff').css('display', 'block');
                $('.topcontent-wrapper').css('display', 'none');
                $(".other-buff").scrollTop($("#al").position().top);
                $('.song-row').contextmenu(function (event) {
                    max_top = $(window).height() - 90 - 230;
                    if (event.pageY > max_top) {
                        $('.song-row-menu').css({
                            bottom: ($(window).height() - event.pageY - 15) + "px",
                            top: 'initial',
                            left: event.pageX + "px",
                            display: "block"
                        });
                    }
                    else {
                        $('.song-row-menu').css({
                            top: event.pageY + "px",
                            left: event.pageX + "px",
                            bottom: 'initial',
                            display: "block"
                        });
                    }
                });
            });
            _this.switch_top("clear", artist.artimg);
        };
        this.parse_albums = function (struct) {
            $.get('templates/albums.mst', function (template) {
                var rendered = Mustache.render(template, struct);
                $('#albums').html(rendered);
                $("#albums").animate({
                    scrollTop: 0
                }, 0);
            });
            _this.switch_top("red", 'none');
            _this.in_songs = false;
        };
        this.parse_playlists = function (struct) {
            $.get('templates/playlists.mst', function (template) {
                var rendered = Mustache.render(template, struct);
                $('#playlists').html(rendered);
                $("#playlists").animate({
                    scrollTop: 0
                }, 0);
            });
            _this.switch_top("red", 'none');
            _this.in_songs = true;
        };
        this.parse_artists = function (struct) {
            $.get('templates/artists.mst', function (template) {
                var rendered = Mustache.render(template, struct);
                $('#artists').html(rendered);
                $("#artists").animate({
                    scrollTop: 0
                }, 0);
            });
            _this.switch_top("red", 'none');
            _this.in_songs = false;
        };
        this.parse_songs = function (struct) {
            $.get('templates/songs.mst', function (template) {
                struct.songs.sort(function (a, b) {
                    var nameA = a.title.toUpperCase(); // ignore upper and lowercase
                    var nameB = b.title.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    // names must be equal
                    return 0;
                });
                var max_top;
                var rendered = Mustache.render(template, struct);
                $('#songs').html(rendered);
                $("#songs").animate({
                    scrollTop: 0
                }, 0);
                $('.song-row').contextmenu(function (event) {
                    max_top = $(window).height() - 90 - 230;
                    if (event.pageY > max_top) {
                        $('.song-row-menu').css({
                            bottom: ($(window).height() - event.pageY - 15) + "px",
                            top: 'initial',
                            left: event.pageX + "px",
                            display: "block"
                        });
                    }
                    else {
                        $('.song-row-menu').css({
                            top: event.pageY + "px",
                            left: event.pageX + "px",
                            bottom: 'initial',
                            display: "block"
                        });
                    }
                });
            });
            _this.switch_top("red", 'none');
            _this.in_songs = true;
        };
        this.parse_playlist = function (struct) {
            $.get('templates/playlist.mst', function (template) {
                var rendered = Mustache.render(template, struct);
                $('.other-buff').html(rendered);
                $('.other-buff').css('display', 'block');
                $('.topcontent-wrapper').css('display', 'none');
                $(".other-buff").scrollTop($("#al").position().top);
                $(".other-buff").animate({
                    scrollTop: 0
                }, 0);
                var max_top;
                $('.song-row').contextmenu(function (event) {
                    max_top = $(window).height() - 90 - 230;
                    if (event.pageY > max_top) {
                        $('.song-row-menu').css({
                            bottom: ($(window).height() - event.pageY - 15) + "px",
                            top: 'initial',
                            left: event.pageX + "px",
                            display: "block"
                        });
                    }
                    else {
                        $('.song-row-menu').css({
                            top: event.pageY + "px",
                            left: event.pageX + "px",
                            bottom: 'initial',
                            display: "block"
                        });
                    }
                });
            });
            _this.switch_top("red", 'none');
            _this.in_playlist = true;
        };
        this.refresh = function () {
            var saveData = $.ajax({
                type: 'POST',
                url: "/library",
                dataType: "text",
                success: function (resultData) {
                    $.getJSON("data/library.json", function (json) {
                        _this.rawSongs = json;
                        _this.parse_songs(_this.rawSongs);
                    });
                    $.getJSON("data/albums.json", function (json) {
                        _this.rawalbums = json;
                        _this.parse_albums(_this.rawalbums);
                    });
                    $.getJSON("data/artists.json", function (json) {
                        _this.rawArtists = json;
                        _this.parse_artists(_this.rawArtists);
                    });
                    $.getJSON("data/playlists.json", function (json) {
                        _this.rawPlaylists = json;
                        for (var i = 0; i != _this.rawPlaylists.playlists.length; i++) {
                            $('#playlist-drop').append("<li class='playlist-item truncate'><a href='#'>" + _this.rawPlaylists.playlists[i].name + "</a></li>");
                        }
                        $('.playlist-item').click(function () {
                            $('#playlist-drop-btn').text($(this).text());
                        });
                        _this.parse_playlists(_this.rawPlaylists);
                    });
                }
            });
        };
        this.app = app;
        this.tabs = new tabs_1.Tabs(this.app, this);
        $('.search').blur(function () {
            $(_this).parent('.top-search-inner').removeClass("white");
            $(_this).parent('.top-search-inner').addClass("with-back");
            $(_this).parent('.top-search-inner').css('box-shadow', 'none');
            $(_this).prev('.search-icon').css('color', '#fff');
            $(_this).css('color', '#fff');
        })
            .focus(function () {
            $(this).parent('.top-search-inner').removeClass("with-back");
            $(this).parent('.top-search-inner').removeClass("red");
            $(this).parent('.top-search-inner').addClass("white");
            $(this).parent('.top-search-inner').css('box-shadow', '0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.4)');
            $(this).parent('.top-search-inner').addClass("white");
            $(this).prev('.search-icon').css('color', '#424242');
            $(this).css('color', '#424242');
        });
    }
    return UI;
}());
exports.UI = UI;

},{"./tabs":6,"mustache":9}],8:[function(require,module,exports){
"use strict";
exports.__esModule = true;
function find(a, b) {
    for (var i = 0; i != b.length; i++) {
        if (b[i] == a) {
            return i;
        }
    }
    return -1;
}
exports.find = find;
String.prototype.format = function () {
    var _args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _args[_i] = arguments[_i];
    }
    var args = _args;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
            ? args[number] : match;
    });
};
Array.prototype.indexOf || (Array.prototype.indexOf = function (d, e) {
    var a;
    if (null == this)
        throw new TypeError('"this" is null or not defined');
    var c = Object(this), b = c.length >>> 0;
    if (0 === b)
        return -1;
    a = +e || 0;
    Infinity === Math.abs(a) && (a = 0);
    if (a >= b)
        return -1;
    for (a = Math.max(0 <= a ? a : b - Math.abs(a), 0); a < b;) {
        if (a in c && c[a] === d)
            return a;
        a++;
    }
    return -1;
});
function error(message) {
    try {
        throw new Error(message);
    }
    catch (e) {
        console.error(e.message);
    }
}
exports.error = error;
function move(el, src, desc) {
    var b = el;
    var index = src.indexOf(el);
    if (index != -1) {
        src.splice(index, 1);
    }
    desc.push(b);
}
exports.move = move;
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
exports.getRandomArbitrary = getRandomArbitrary;
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.getRandomInt = getRandomInt;

},{}],9:[function(require,module,exports){
/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false Mustache: true*/

(function defineMustache (global, factory) {
  if (typeof exports === 'object' && exports && typeof exports.nodeName !== 'string') {
    factory(exports); // CommonJS
  } else if (typeof define === 'function' && define.amd) {
    define(['exports'], factory); // AMD
  } else {
    global.Mustache = {};
    factory(global.Mustache); // script, wsh, asp
  }
}(this, function mustacheFactory (mustache) {

  var objectToString = Object.prototype.toString;
  var isArray = Array.isArray || function isArrayPolyfill (object) {
    return objectToString.call(object) === '[object Array]';
  };

  function isFunction (object) {
    return typeof object === 'function';
  }

  /**
   * More correct typeof string handling array
   * which normally returns typeof 'object'
   */
  function typeStr (obj) {
    return isArray(obj) ? 'array' : typeof obj;
  }

  function escapeRegExp (string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }

  /**
   * Null safe way of checking whether or not an object,
   * including its prototype, has a given property
   */
  function hasProperty (obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var regExpTest = RegExp.prototype.test;
  function testRegExp (re, string) {
    return regExpTest.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace (string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   */
  function parseTemplate (template, tags) {
    if (!template)
      return [];

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace () {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags (tagsToCompile) {
      if (typeof tagsToCompile === 'string')
        tagsToCompile = tagsToCompile.split(spaceRe, 2);

      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error('Invalid tags: ' + tagsToCompile);

      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n')
            stripSpace();
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      token = [ type, value, start, scanner.pos ];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens (tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens (tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
        case '#':
        case '^':
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case '/':
          section = sections.pop();
          section[5] = token[2];
          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner (string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function eos () {
    return this.tail === '';
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function scan (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function scanUntil (re) {
    var index = this.tail.search(re), match;

    switch (index) {
      case -1:
        match = this.tail;
        this.tail = '';
        break;
      case 0:
        match = '';
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context (view, parentContext) {
    this.view = view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function push (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function lookup (name) {
    var cache = this.cache;

    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this, names, index, lookupHit = false;

      while (context) {
        if (name.indexOf('.') > 0) {
          value = context.view;
          names = name.split('.');
          index = 0;

          /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           **/
          while (value != null && index < names.length) {
            if (index === names.length - 1)
              lookupHit = hasProperty(value, names[index]);

            value = value[names[index++]];
          }
        } else {
          value = context.view[name];
          lookupHit = hasProperty(context.view, name);
        }

        if (lookupHit)
          break;

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer () {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function clearCache () {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function parse (template, tags) {
    var cache = this.cache;
    var tokens = cache[template];

    if (tokens == null)
      tokens = cache[template] = parseTemplate(template, tags);

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   */
  Writer.prototype.render = function render (template, view, partials) {
    var tokens = this.parse(template);
    var context = (view instanceof Context) ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);
      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);
      else if (symbol === '>') value = this.renderPartial(token, context, partials, originalTemplate);
      else if (symbol === '&') value = this.unescapedValue(token, context);
      else if (symbol === 'name') value = this.escapedValue(token, context);
      else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender (template) {
      return self.render(template, context, partials);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
      }
    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
    }
    return buffer;
  };

  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate);
  };

  Writer.prototype.renderPartial = function renderPartial (token, context, partials) {
    if (!partials) return;

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null)
      return this.renderTokens(this.parse(value), context, partials, value);
  };

  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype.escapedValue = function escapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return mustache.escape(value);
  };

  Writer.prototype.rawValue = function rawValue (token) {
    return token[1];
  };

  mustache.name = 'mustache.js';
  mustache.version = '2.3.0';
  mustache.tags = [ '{{', '}}' ];

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function clearCache () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function parse (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  mustache.render = function render (template, view, partials) {
    if (typeof template !== 'string') {
      throw new TypeError('Invalid template! Template should be a "string" ' +
                          'but "' + typeStr(template) + '" was given as the first ' +
                          'argument for mustache#render(template, view, partials)');
    }

    return defaultWriter.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.,
  /*eslint-disable */ // eslint wants camel cased function name
  mustache.to_html = function to_html (template, view, partials, send) {
    /*eslint-enable*/

    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

  return mustache;
}));

},{}]},{},[1,2,4,5,7,8]);
