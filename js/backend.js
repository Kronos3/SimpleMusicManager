try { // So that we can test in the browser
    const remote = require('electron').remote;
}
catch (err) {
    $(document).ready(function(){
        $('.title-bar').css('display', 'none');
        $('.window').css('height', '100vh');
    });
}

var navOpened = 0;
var is_changing = false
$(document).ready(function(){
    $('.tooltipped').tooltip({delay: 2000});
    document.querySelector('#song-time').addEventListener('immediate-value-change', function(e) {
        window.is_changing = true;
    });
    document.querySelector('#song-time').addEventListener('change', function(e) {;
        window.currentSong.playing.currentTime = document.querySelector('#song-time').value
        window.is_changing = false;
    });
    document.querySelector('#song-vol').addEventListener('immediate-value-change', function(e) {;
        window.currentSong.playing.volume = (document.querySelector('#song-vol').value / 100);
    });
});

currentSong = new Object();
currentSong.playing = new Audio;
window.currentSong.playing.volume = .5
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
    if (window.n_repeat != 2)
        {
            window.n_repeat = window.n_repeat + 1;
        }
    else
        {
            window.n_repeat = 0;
        }
    if (window.n_repeat === 0)
        {
            $("#repeat").css ("color", "#424242");
            $("#repeat > i").text ("repeat");
        }
    else if (window.n_repeat === 1)
        {
            $("#repeat").css ("color", "#ef5350");
            $("#repeat > i").text ("repeat");
        }
    else if (window.n_repeat === 2)
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
    if ($('#play').hasClass('disabled')){
        $(window.currentSong.songDiv).children('.tbl-num').children('span').css('background-image', "url(''");
        return;
    }
    if (play==undefined){
        if (window.n_play === 0)
            {
                window.n_play = 1;
                $("#play > i").text ("pause");
                window.currentSong.playing.play ();
                $(window.currentSong.songDiv).children('.tbl-num').children('span').css('background-image', "url('img/playing.gif')");
            }
        else
            {
                window.n_play = 0;
                $("#play > i").text("play_arrow");
                window.currentSong.playing.pause ();
                $(window.currentSong.songDiv).children('.tbl-num').children('span').css('background-image', "url('img/paused.png')");
            }
        $('#play').toggleClass("paused");
    }
    else if (play) {
        window.n_play = 1;
        $("#play > i").text ("pause");
        window.currentSong.playing.play ();
        $(window.currentSong.songDiv).children('.tbl-num').children('span').css('background-image', "url('img/playing.gif')");
        $('#play').removeClass("paused");
    }
    else if (!play) {
        window.n_play = 0;
        $("#play > i").text("play_arrow");
        window.currentSong.playing.pause ();
        $(window.currentSong.songDiv).children('.tbl-num').children('span').css('background-image', "url('img/paused.png')");
    }
}

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
                parse_songs(json);
                window.songs = json;
            });
            $.getJSON( "data/albums.json", function( json ) {
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

function song_click (s) {
    start_load ();
    $('#play').removeClass ('disabled');
    $('#back').removeClass ('disabled');
    $('#skip').removeClass ('disabled');
    
    s = $(s);
    if (s.data ('streamurl') == '') {
        var saveData = $.ajax({
            type: 'STREAM',
            url: "/" + s.data ('index'),
            dataType: "text",
            success: function(resultData) { 
                s.data ('streamurl', resultData);
                play_song (s);
            }
        });
        saveData.error(function() {});
    }
    else {
        urlExists(s.data('streamurl'), function (status){
            if (!status) {
                var saveData = $.ajax({
                    type: 'STREAM',
                    url: "/" + s.data ('index'),
                    dataType: "text",
                    success: function(resultData) { 
                        s.data ('streamurl', resultData);
                        play_song (s);
                    }
                });
            }
            else {
                play_song (s);
            }
        });
    }
}

function urlExists(url, callback){
    $.ajax({
        type: 'HEAD',
        url: url,
        success: function(){
            callback(true);
        },
        error: function() {
            callback(false);
        }
    });
}

function play_song (s) {
    playf(false);
    y = window.songs.songs[$(s).data('index')]
    try {
        window.currentSong.playing.src = s.data('streamurl');
    }
    catch (err) {
        end_load ();
        return false;
    }
    
    /* Set background of the previous play back to default */
    if (window.currentSong.songDiv != undefined) {
        $(window.currentSong.songDiv).children('.tbl-num').children('span').css('background-image', 'url({0})'.format (window.currentSong.songObj.albumArtRef[0].url));
    }
    
    window.currentSong.songObj = y;
    window.currentSong.songName = y.title;
    window.currentSong.songArtist = y.artist;
    window.currentSong.songAlbum = y.album;
    window.currentSong.songDiv = s;
    try {
        window.currentSong.songArt = y.albumArtRef[0].url;
    }
    catch (err) {
        window.currentSong.songArt = '';
    }
    $.get('templates/songinfo.mst', function(template) {
        var rendered = Mustache.render(template, window.currentSong);
        $('#song-info-template').html(rendered);
    });
    playf (true);
    $('#song-time').css('display', 'block');
    end_load ();
    return true;
}

function next_song () {
    if ($('#next').hasClass('disabled')) {
        return;
    }
    if (window.n_repeat == 0) {
        n = $(window.currentSong.songDiv).next ();
        if (n.height() == null) {
            $('#song-info-template').html('');
            $('#song-time').css('display', 'none');
            playf(false);
            $('#play').addClass ('disabled');
            $('#skip').addClass ('disabled');
            $('#back').addClass('disabled')
            return;
        }
    }
    else if (window.n_repeat == 1) {
        n = $(window.currentSong.songDiv).next ();
        if (n.height() == null && window.n_repeat == 1) {
            n = $(window.currentSong.songDiv).first();
        }
    }
    else if (window.n_repeat == 2) {
        n = window.currentSong.songDiv;
    }
    
    song_click (n);
}

function prev_song () {
    if ($('#back').hasClass('disabled')) {
        return;
    }
    if (parseInt(window.currentSong.playing.currentTime) > 5) {
        window.currentSong.playing.currentTime = 0;
    }
    else {
        n = $(window.currentSong.songDiv).prev ();
        if (n.height() == null) {
            window.currentSong.playing.currentTime = 0;
            return;
        }
    }
    song_click (n);
}

check_login();

window.currentSong.playing.addEventListener('progress', function() {
    try {
        var bufferedEnd = window.currentSong.playing.buffered.end(window.currentSong.playing.buffered.length - 1);
    }
    catch (err) {
        bufferedEnd = document.querySelector('#song-time').secondaryProgress;
    }
    var duration =  window.currentSong.playing.duration;
    if (duration > 0) {
      document.querySelector('#song-time').secondaryProgress = bufferedEnd;
    }
});

window.currentSong.playing.addEventListener('timeupdate', function() {
    var duration = window.currentSong.playing.duration;
    try {
        document.querySelector('#song-time').max = duration;
    }
    catch (err) 
    {
        ;
    }
    if (duration > 0) {
        if (!window.is_changing) {
            document.querySelector('#song-time').value = window.currentSong.playing.currentTime;
        }
    }
});

window.currentSong.playing.onended = function() {
    next_song ();
};
