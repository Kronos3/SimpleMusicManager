import {App} from "./main"
import {Tabs} from "./tabs"
declare function require(name:string);
var Mustache = require ("mustache");
declare var $;

export class UI {
    app: App;
    in_songs: boolean;
    in_playlist: boolean;
    tabs: Tabs;
    navOpened: boolean;
    
    constructor (app: App) {
        this.app = app;
        this.tabs = new Tabs (this.app, this);
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

    get = (s: string) => {
        return document.querySelector (s);
    }

    scrolled = () => {
        if ($(".other-buff > .album").position() == undefined || this.in_songs) {
            return;
        }
        
        if ($('.other-buff > .album').hasClass ('playlist-wrapper')) {
            return;
        }
        
        var elmnt = document.querySelector(".other-buff");
        var x = elmnt.scrollLeft;
        var y = elmnt.scrollTop;
        if (y >= ($(".other-buff > .album").position().top)) {
            this.switch_top('red', '');
        }
        else if (y == (elmnt.scrollHeight - (<any>elmnt).offsetHeight)) {
            this.switch_top('red', '');
        }
        else {
            this.switch_top('clear', '');
        }
    }

    switch_top = (t, artist_img = undefined) => {
        if (t == "red") {
            if (artist_img == "none") {
                $('.window').css ('background-image', "");
            }
            else if (artist_img != ''){
                $('.window').css ('background-image', "url(" + artist_img + ")");
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
            if (artist_img != ''){
                $('.window').css ('background-image', "url(" + artist_img + ")");
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
    }

    contextObj: Element;
    goto_album = (album) => {
        $.get('templates/album.mst', function(template) {
            album.songs.sort (function (a, b) {
                return a.trackNumber - b.trackNumber;
            });
            var max_top;
            var rendered = Mustache.render(template, album);
            $('.other-buff').html(rendered);
            $('.other-buff').css ('display', 'block');
            $('.topcontent-wrapper').css ('display', 'none');
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
                (<any>window).APP.ui.contextObj = $(this).get(0);
            });
        });
        this.switch_top ("clear", album.artimg);
    }

    goto_artist = (artist) => {
        $.get('templates/artist.mst', function(template) {
            for (var i=0; i != artist.albums.length; i++) {
                artist.albums[i].songs.sort (function (a, b) {
                    return a.trackNumber - b.trackNumber;
                });
            }
            var rendered = Mustache.render(template, artist);
            $('.other-buff').html(rendered);
            $('.other-buff').css ('display', 'block');
            $('.topcontent-wrapper').css ('display', 'none');
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
                (<any>window).APP.ui.contextObj = $(this).get(0);
            });
        });
        this.switch_top ("clear", artist.artimg);
    }


    parse_albums = (struct) => {
        $.get('templates/albums.mst', function(template) {
            var rendered = Mustache.render(template, struct);
            $('#albums').html(rendered);
            $("#albums").animate({
                    scrollTop: 0
                }, 0);
        });
        this.switch_top ("red", 'none');
        this.in_songs = false;
    }

    parse_playlists = (struct) => {
        $.get('templates/playlists.mst', function(template) {
            var rendered = Mustache.render(template, struct);
            $('#playlists').html(rendered);
            $("#playlists").animate({
                    scrollTop: 0
                }, 0);
        });
        this.switch_top ("red", 'none');
        this.in_songs = true;
    }

    parse_artists = (struct) => {
        $.get('templates/artists.mst', function(template) {
            var rendered = Mustache.render(template, struct);
            $('#artists').html(rendered);
            $("#artists").animate({
                    scrollTop: 0
                }, 0);
        });
        this.switch_top ("red", 'none');
        this.in_songs = false;
    }

    parse_songs = (struct) => {
        $.get('templates/songs.mst', function(template) {
            struct.songs.sort(function(a, b) {
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
                (<any>window).APP.ui.contextObj = $(this).get(0);
            });
        });
        this.switch_top ("red", 'none');
        this.in_songs = true;
    }

    parse_playlist = (struct) => {
        $.get('templates/playlist.mst', function(template) {
            var rendered = Mustache.render(template, struct);
            $('.other-buff').html(rendered);
            $('.other-buff').css ('display', 'block');
            $('.topcontent-wrapper').css ('display', 'none');
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
                (<any>window).APP.ui.contextObj = $(this).get(0);
            });
        });
        this.switch_top ("red", 'none');
        this.in_playlist = true;
    }

    rawSongs;
    rawalbums;
    rawArtists;
    rawPlaylists;

    refresh = () => {
        var saveData = $.ajax({
            type: 'POST',
            url: "/library",
            dataType: "text",
            success: (resultData) => { 
                $.getJSON( "data/library.json", ( json ) => {
                    this.rawSongs = json;
                    this.app.songcontroller.genMetaFromRaw (this.rawSongs);
                    this.parse_songs(this.rawSongs);
                });
                $.getJSON( "data/albums.json", ( json ) => {
                    this.rawalbums = json
                    this.parse_albums(this.rawalbums);
                });
                $.getJSON( "data/artists.json", ( json ) => {
                    this.rawArtists = json
                    this.parse_artists(this.rawArtists);
                });
                $.getJSON( "data/playlists.json", ( json ) => {
                    this.rawPlaylists = json
                    for (var i = 0; i != this.rawPlaylists.playlists.length; i++) {
                        $('#playlist-drop').append ("<li class='playlist-item truncate'><a href='#'>" + this.rawPlaylists.playlists[i].name + "</a></li>");
                    }
                    $('.playlist-item').click (function () {
                        $('#playlist-drop-btn').text ($(this).text());
                    });
                    this.parse_playlists(this.rawPlaylists);
                });
            }
        });
    }

    context = (event) => {
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
        console.log (this);
        //(<any>window).APP.ui.contextObj = $(this).get(0);
    }

    openNav = () => {
        "use strict";
        if (!this.navOpened) {
            $("#menu > i").css("color", "#212121");
            $("#nav").css("left", "0px");
            $("#menu").css("color", "rgb(255, 255, 255)");
            $("#menu > i").text("close");
            this.navOpened = true;
            $('.disable-nav').css('display', 'block');
            $('.disable-nav').css('z-index', '104');
        }
        else {
            $("#menu > i").css("color", "#fff");
            $("#nav").css("left", "-280px");
            $("#menu").addClass("white");
            $("#menu").css("color", "rgb(80, 77, 71)");
            $("#menu > i").text("menu");
            this.navOpened = false;
            $('.disable-nav').css('display', 'none');
            $('.disable-nav').css('z-index', '-1');
        }
    }
}