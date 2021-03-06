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
                    var max_top;
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
                    window.APP.ui.contextObj = $(this).get(0);
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
                var rendered = Mustache.render(template, artist);
                $('.other-buff').html(rendered);
                $('.other-buff').css('display', 'block');
                $('.topcontent-wrapper').css('display', 'none');
                $(".other-buff").scrollTop($("#al").position().top);
                $('.song-row').contextmenu(function (event) {
                    var max_top;
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
                    window.APP.ui.contextObj = $(this).get(0);
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
                var rendered = Mustache.render(template, struct);
                $('#songs').html(rendered);
                $("#songs").animate({
                    scrollTop: 0
                }, 0);
                $('.song-row').contextmenu(function (event) {
                    var max_top;
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
                    window.APP.ui.contextObj = $(this).get(0);
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
                $('.song-row').contextmenu(function (event) {
                    var max_top;
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
                    window.APP.ui.contextObj = $(this).get(0);
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
                        _this.app.songcontroller.genMetaFromRaw(_this.rawSongs);
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
        this.context = function (event) {
            var max_top;
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
            console.log(_this);
            //(<any>window).APP.ui.contextObj = $(this).get(0);
        };
        this.openNav = function () {
            "use strict";
            if (!_this.navOpened) {
                $("#menu > i").css("color", "#212121");
                $("#nav").css("left", "0px");
                $("#menu").css("color", "rgb(255, 255, 255)");
                $("#menu > i").text("close");
                _this.navOpened = true;
                $('.disable-nav').css('display', 'block');
                $('.disable-nav').css('z-index', '104');
            }
            else {
                $("#menu > i").css("color", "#fff");
                $("#nav").css("left", "-280px");
                $("#menu").addClass("white");
                $("#menu").css("color", "rgb(80, 77, 71)");
                $("#menu > i").text("menu");
                _this.navOpened = false;
                $('.disable-nav').css('display', 'none');
                $('.disable-nav').css('z-index', '-1');
            }
        };
        this.app = app;
        this.tabs = new tabs_1.Tabs(this.app, this);
        $('.search').blur(function () {
            $(this).parent('.top-search-inner').removeClass("white");
            $(this).parent('.top-search-inner').addClass("with-back");
            $(this).parent('.top-search-inner').css('box-shadow', 'none');
            $(this).prev('.search-icon').css('color', '#fff');
            $(this).css('color', '#fff');
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
        this.navOpened = false;
    }
    return UI;
}());
exports.UI = UI;
