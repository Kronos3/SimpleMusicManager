//const remote = require('electron').remote;


var navOpened = 0;

 $(document).ready(function(){
    $('.tooltipped').tooltip({delay: 2000});
  });

function openNav() {
    "use strict";
    if (navOpened === 0) {
        $("#menu > i").css("color", "#212121");
        $("#nav").css("left", "0px");
        $("#menu").css("color", "rgb(255, 255, 255)");
        $("#menu > i").text("close");
        navOpened = 1;
        $('.disable-nav').css('display', 'block');
        $('.disable-nav').css('z-index', '104');
    }
    else {
        $("#menu > i").css("color", "#fff");
        $("#nav").css("left", "-280px");
        $("#menu").addClass("white");
        $("#menu").css("color", "rgb(80, 77, 71)");
        $("#menu > i").text("menu");
        navOpened = 0;
        $('.disable-nav').css('display', 'none');
        $('.disable-nav').css('z-index', '-1');
    }
}

 $(document).ready(function() {

    $('#search').blur(function() {
        $('.top-search-inner').removeClass("white");
        $('.top-search-inner').addClass("with-back");
        $('.top-search-inner').css('box-shadow', 'none');
        $('.search-icon').css('color', '#fff');
        $('.search').css('color', '#fff');
      })
      .focus(function() {
        $('.top-search-inner').removeClass("with-back");
        $('.top-search-inner').removeClass("red");
        $('.top-search-inner').addClass("white");
        $('.top-search-inner').css('box-shadow', '0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.4)');
        $('.top-search-inner').addClass("white");
        $('.search-icon').css('color', '#424242');
        $('.search').css('color', '#424242');
      });
});

var n_repeat = 0;
var n_shuffle = 0;
var n_play = 0;

function repeatf () {
    if (n_repeat != 2)
        {
            n_repeat = n_repeat + 1;
        }
    else
        {
            n_repeat = 0;
        }
    if (n_repeat === 0)
        {
            $("#repeat").css ("color", "#424242");
            $("#repeat > i").text ("repeat");
        }
    else if (n_repeat === 1)
        {
            $("#repeat").css ("color", "#ef5350");
            $("#repeat > i").text ("repeat");
        }
    else if (n_repeat === 2)
        {
            $("#repeat > i").text("repeat_one");
        }
}

function shufflef () {
    if (n_shuffle === 0)
        {
            n_shuffle = 1;
            $("#shuffle").css ("color", "#ef5350");
        }
    else
        {
            n_shuffle = 0;
            $("#shuffle").css ("color", "#424242");
        }
}

function playf (play) {
    if (typeof(a)==='undefined'){
        if (n_play === 0)
            {
                n_play = 1;
                $("#play > i").text ("pause");
                window.playing.play ();
            }
        else
            {
                n_play = 0;
                $("#play > i").text("play_arrow");
                window.playing.pause ();
            }
        $('#play').toggleClass("paused");
    }
    else if (play) {
        n_play = 1;
        $("#play > i").text ("pause");
        window.playing.play ();
        $('#play').removeClass("paused");
    }
    else if (!play) {
        n_play = 0;
        $("#play > i").text("play_arrow");
        window.playing.pause ();
    }
}
/*
function minimize(){
    var window = remote.getCurrentWindow();
    window.minimize();  
}

function close_win(){
    var window = remote.getCurrentWindow();
    window.close();  
}

$( window ).resize(function() {
    var window = remote.getCurrentWindow ()
    if (window.isMaximized())
    {
        //$("#max").css("background-image", "url(img/unmaximize.png)");
    }
    else
    {
        $("#max").css("background-image", "url(img/maximize.png)");
    }
});

function maximize(){
    var window = remote.getCurrentWindow ()
    if (window.isMaximized())
    {
        window.unmaximize();
    }
    else
    {
        window.maximize ();
    }
}
*/
function nav_close() {
    $("#menu").addClass("with-back");
    $("#menu").removeClass("white");
    $("#menu > i").css("color", "#fff");
    $("#nav").css("left", "-280px");
    $("#menu").css("color", "rgb(80, 77, 71)");
    $("#menu > i").text("menu");
    navOpened = 0;
    $('.disable-nav').css('display', 'none');
}


function open_login () {
    $('.login').css('display', 'block');
    $('.disable').css('display', 'block');
    $('.disable').css('z-index', '104');
}

function login_close() {
    $('.login').css('display', 'none');
    $('.disable').css('display', 'none');
    $('.disable').css('z-index', '-1');
}

function login_load (path){
    if (path != "http://localhost:8000/oauth/"){
        login_close ();
        $('#sign-in').css ('display', 'none');
    }
}

function check_login () {
    var saveData = $.ajax({
        type: 'POST',
        url: "/check_login",
        dataType: "text",
        success: function(resultData) { 
            login_close ();
            $('#sign-in').css ('display', 'none');
            refresh();
        }
    });
    saveData.error(function() {open_login();});
}

songs = null;
albums = null;
artist = null;
playlists = null;

function refresh () {
    var saveData = $.ajax({
        type: 'POST',
        url: "/library",
        dataType: "text",
        success: function(resultData) { 
            $.getJSON( "data/library.json", function( json ) {
                window.songs = json;
            });
            $.getJSON( "data/albums.json", function( json ) {
                parse_albums(json);
                window.albums = json
            });
            $.getJSON( "data/artists.json", function( json ) {
                window.artists = json
            });
            $.getJSON( "data/playlists.json", function( json ) {
                window.playlists = json
            });
        }
    });
    saveData.error(function() {});
}

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

function switch_top (t, artist_img) {
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

in_songs = false

function scrolled () {
    if ($(".album").position() == undefined || window.in_songs) {
        return;
    }
    var elmnt = document.getElementById("main");
    var x = elmnt.scrollLeft;
    var y = elmnt.scrollTop;
    if (y >= ($(".album").position().top)*2) {
        switch_top('red', '');
    }
    else if (y == (elmnt.scrollHeight - elmnt.offsetHeight)) {
        switch_top('red', '');
    }
    else {
        switch_top('clear', '');
    }
}

function goto_album (album) {
    $.get('templates/album.mst', function(template) {
        var rendered = Mustache.render(template, album);
        $('#main').html(rendered);
        document.getElementById('al').scrollIntoView();
    });
    switch_top ("clear", album.artimg);
}

function goto_artist (artist) {
    $.get('templates/artist.mst', function(template) {
        var rendered = Mustache.render(template, artist);
        $('#main').html(rendered);
        document.getElementById('al').scrollIntoView();
    });
    switch_top ("clear", artist.artimg);
}

function parse_albums (struct) {
    $.get('templates/albums.mst', function(template) {
        var rendered = Mustache.render(template, struct);
        $('#main').html(rendered);
        $("#main").animate({
                scrollTop: 0
            }, 0);
    });
    switch_top ("red", 'none');
    window.in_songs = false;
}

function parse_playlists (struct) {
    $.get('templates/playlists.mst', function(template) {
        var rendered = Mustache.render(template, struct);
        $('#main').html(rendered);
        $("#main").animate({
                scrollTop: 0
            }, 0);
    });
    switch_top ("red", 'none');
    window.in_songs = true;
}

function parse_artists (struct) {
    $.get('templates/artists.mst', function(template) {
        var rendered = Mustache.render(template, struct);
        $('#main').html(rendered);
        $("#main").animate({
                scrollTop: 0
            }, 0);
    });
    switch_top ("red", 'none');
    window.in_songs = false;
}

function parse_songs (struct) {
    $.get('templates/songs.mst', function(template) {
        var rendered = Mustache.render(template, struct);
        $('#main').html(rendered);
        $("#main").animate({
                scrollTop: 0
            }, 0);
    });
    switch_top ("red", 'none');
    window.in_songs = true;
}

function start_load () {
    $('.loader').css('display', 'block');
}

function end_load () {
    $('.loader').css('display', 'none');
}

window.playing = new Audio ();

function song_click (s) {
    s = $(s);
    if (s.data ('streamurl') == '') {
        start_load ();
        var saveData = $.ajax({
            type: 'STREAM',
            url: "/" + s.data ('index'),
            dataType: "text",
            success: function(resultData) { 
                s.data ('streamurl', resultData);
                end_load ();
                play_song (s.data('streamurl'));
            }
        });
        saveData.error(function() {});
    }
    else {
        play_song (s.data('streamurl'));
    }
}

function play_song (url) {
    window.playing.src = url;
    playf (true);
}

check_login();

window.playing.addEventListener('progress', function() {
    var bufferedEnd = window.playing.buffered.end(window.playing.buffered.length - 1);
    var duration =  window.playing.duration;
    if (duration > 0) {
      document.querySelector('#song-time').secondaryProgress = bufferedEnd;
    }
});

window.playing.addEventListener('timeupdate', function() {
    var duration = window.playing.duration;
    document.querySelector('#song-time').max = duration;
    if (duration > 0) {
        document.querySelector('#song-time').value = window.playing.currentTime;
    }
});
