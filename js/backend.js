remote = null;
try { // So that we can test in the browser
    window.remote = require('electron').remote;
}
catch (err) {
    $(document).ready(function(){
        $('.title-bar').css('display', 'none');
        $('.window').css('height', '100vh');
    });
}

$(document).ready(function() {
    $('select').material_select();
});

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
        window.currentSong.playing.volume = (document.querySelector('#song-vol').immediateValue / 100);
    });
    document.querySelector('#song-vol').addEventListener('change', function(e) {
        window.currentSong.playing.volume = (document.querySelector('#song-vol').value / 100);
    });
    $('#ytsearch').keypress(function (e) {
        if (e.which == 13) {
            searchYT ($(this).val());
        }
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

    $('.search').blur(function() {
        $(this).parent('.top-search-inner').removeClass("white");
        $(this).parent('.top-search-inner').addClass("with-back");
        $(this).parent('.top-search-inner').css('box-shadow', 'none');
        $(this).prev('.search-icon').css('color', '#fff');
        $(this).css('color', '#fff');
      })
      .focus(function() {
        $(this).parent('.top-search-inner').removeClass("with-back");
        $(this).parent('.top-search-inner').removeClass("red");
        $(this).parent('.top-search-inner').addClass("white");
        $(this).parent('.top-search-inner').css('box-shadow', '0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.4)');
        $(this).parent('.top-search-inner').addClass("white");
        $(this).prev('.search-icon').css('color', '#424242');
        $(this).css('color', '#424242');
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
                $(window.currentSong.songDiv).children('.tbl-num').children('.song-number').css ('color', 'rgba(255,255,255,0)');
                $(window.currentSong.songDiv).children('.tbl-num').children('span').css('background-image', "url('img/playing.gif')");
            }
        else
            {
                window.n_play = 0;
                $("#play > i").text("play_arrow");
                window.currentSong.playing.pause ();
                $(window.currentSong.songDiv).children('.tbl-num').children('.song-number').css ('color', 'rgba(255,255,255,0)');
                $(window.currentSong.songDiv).children('.tbl-num').children('span').css('background-image', "url('img/paused.png')");
            }
        $('#play').toggleClass("paused");
    }
    else if (play) {
        window.n_play = 1;
        $("#play > i").text ("pause");
        window.currentSong.playing.play ();
        $(window.currentSong.songDiv).children('.tbl-num').children('.song-number').css ('color', 'rgba(255,255,255,0)');
        $(window.currentSong.songDiv).children('.tbl-num').children('span').css('background-image', "url('img/playing.gif')");
        $('#play').removeClass("paused");
    }
    else if (!play) {
        window.n_play = 0;
        $("#play > i").text("play_arrow");
        window.currentSong.playing.pause ();
        $(window.currentSong.songDiv).children('.tbl-num').children('.song-number').css ('color', 'rgba(255,255,255,0)');
        $(window.currentSong.songDiv).children('.tbl-num').children('span').css('background-image', "url('img/paused.png')");
    }
}

function minimize(){
    var window = remote.getCurrentWindow();
    window.minimize();  
}

function close_win(){
    var window = remote.getCurrentWindow();
    $.ajax({
        type: 'SHUTDOWN',
        url: '/',
        success: function(){
            ;
        },
    });
    window.close();
}

$( window ).resize(function() {
    try {
        var window = remote.getCurrentWindow ()
        if (window.isMaximized())
        {
            //$("#max").css("background-image", "url(img/unmaximize.png)");
        }
        else
        {
            $("#max").css("background-image", "url(img/maximize.png)");
        }
    }
    catch (err) {
        ;
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
        refresh();
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
                parse_songs(window.songs);
            });
            $.getJSON( "data/albums.json", function( json ) {
                window.albums = json
                parse_albums(window.albums);
            });
            $.getJSON( "data/artists.json", function( json ) {
                window.artists = json
                parse_artists(window.artists);
            });
            $.getJSON( "data/playlists.json", function( json ) {
                window.playlists = json
                for (var i = 0; i != window.playlists.playlists.length; i++) {
                    $('#playlist-drop').append ("<li class='playlist-item truncate'><a href='#'>" + window.playlists.playlists[i].name + "</a></li>");
                }
                $('.playlist-item').click (function () {
                    $('#playlist-drop-btn').text ($(this).text());
                });
                parse_playlists(window.playlists);
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
    if ($(".other-buff > .album").position() == undefined || window.in_songs) {
        return;
    }
    var elmnt = document.querySelector(".other-buff");
    var x = elmnt.scrollLeft;
    var y = elmnt.scrollTop;
    if (y >= ($(".other-buff > .album").position().top)) {
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
        $('.other-buff').html(rendered);
        $('.other-buff').css ('display', 'block');
        $('.topcontent-wrapper').css ('display', 'none');
        /*document.getElementById('al').scrollIntoView();*/
        $(".other-buff").scrollTop($("#al").position().top);
        $('.song-row').contextmenu(function(event) {
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
            window.song_obj_right = $(this)
        });
    });
    switch_top ("clear", album.artimg);
}

function goto_artist (artist) {
    $.get('templates/artist.mst', function(template) {
        var rendered = Mustache.render(template, artist);
        $('.other-buff').html(rendered);
        $('.other-buff').css ('display', 'block');
        $('.topcontent-wrapper').css ('display', 'none');
        $(".other-buff").scrollTop($("#al").position().top);
        $('.song-row').contextmenu(function(event) {
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
            window.song_obj_right = $(this)
        });
    });
    switch_top ("clear", artist.artimg);
}


function parse_albums (struct) {
    $.get('templates/albums.mst', function(template) {
        var rendered = Mustache.render(template, struct);
        $('#albums').html(rendered);
        $("#albums").animate({
                scrollTop: 0
            }, 0);
    });
    switch_top ("red", 'none');
    window.in_songs = false;
}

function parse_playlists (struct) {
    $.get('templates/playlists.mst', function(template) {
        var rendered = Mustache.render(template, struct);
        $('#playlists').html(rendered);
        $("#playlists").animate({
                scrollTop: 0
            }, 0);
    });
    switch_top ("red", 'none');
    window.in_songs = true;
}

function parse_artists (struct) {
    $.get('templates/artists.mst', function(template) {
        var rendered = Mustache.render(template, struct);
        $('#artists').html(rendered);
        $("#artists").animate({
                scrollTop: 0
            }, 0);
    });
    switch_top ("red", 'none');
    window.in_songs = false;
}

song_obj_right = null;
$(document).ready(function(){
    $('.materialboxed').materialbox();
});

function parse_songs (struct) {
    $.get('templates/songs.mst', function(template) {
        var rendered = Mustache.render(template, struct);
        $('#songs').html(rendered);
        $("#songs").animate({
                scrollTop: 0
            }, 0);
        $('.song-row').contextmenu(function(event) {
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
            window.song_obj_right = $(this)
        });
    });
    switch_top ("red", 'none');
    window.in_songs = true;
}

function parse_playlist (struct) {
    $.get('templates/playlist.mst', function(template) {
        var rendered = Mustache.render(template, struct);
        $('.other-buff').html(rendered);
        $('.other-buff').css ('display', 'block');
        $('.topcontent-wrapper').css ('display', 'none');
        $(".other-buff").scrollTop($("#al").position().top);
        $(".other-buff").animate({
                scrollTop: 0
            }, 0);
        $('.song-row').contextmenu(function(event) {
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
            window.song_obj_right = $(this)
        });
    });
    switch_top ("red", 'none');
    window.in_playlist = true;
}

function start_load () {
    $('.loader').css('display', 'block');
}

function end_load () {
    $('.loader').css('display', 'none');
}

function inc_song_play () {
    $.ajax({
        type: 'INC',
        url: '/{0}'.format ($(window.currentSong.songDiv).data ('id')),
        success: function(){
            $.getJSON( "data/library.json?nocache=" + (new Date()).getTime(), function( json ) {
                window.songs = json;
            });
            $.getJSON( "data/albums.json?nocache=" + (new Date()).getTime(), function( json ) {
                window.albums = json
            });
            $.getJSON( "data/artists.json?nocache=" + (new Date()).getTime(), function( json ) {
                window.artists = json
            });
            $.getJSON( "data/playlists.json?nocache=" + (new Date()).getTime(), function( json ) {
                window.playlists = json
                for (var i = 0; i != window.playlists.playlists.length; i++) {
                    $('#playlist-drop').append ("<li class='playlist-item truncate'><a href='#'>" + window.playlists.playlists[i].name + "</a></li>");
                }
                $('.playlist-item').click (function () {
                    $('#playlist-drop-btn').text ($(this).text());
                });
            });
            $(window.currentSong.songDiv).children('.tbl-plays').text (parseInt($(window.currentSong.songDiv).children('.tbl-plays').text()) + 1);
        },
    });
    
}

function song_click (s) {
    if ($(s).hasClass ('is-dragging')) {
        return;
    }
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
    if (window.currentSong.songDivNoClone != undefined) {
        if ($(window.currentSong.songDivNoClone).children('.tbl-num').children('.song-number').text() == '') {
            $(window.currentSong.songDivNoClone).children('.tbl-num').children('span').css('background-image', 'url({0})'.format (window.currentSong.songObj.albumArtRef[0].url));
        }
        $(window.currentSong.songDivNoClone).children('.tbl-num').children('.song-number').css ('color', '#212121');
    }
    delete window.currentSong.songDiv
    window.currentSong.songObj = y;
    window.currentSong.songName = y.title;
    window.currentSong.songArtist = y.artist;
    window.currentSong.songAlbum = y.album;
    window.currentSong.songDiv = clone (s);
    window.currentSong.songDivNoClone = s;
    inc_song_play ();
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

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function ar_find (item, array) {
    for (var x = 0; x != array.length; x++) {
        if (item.html() == array[x].html()){
            return x;
        }
    }
    return -1;
}

function next_song () {
    if ($('#next').hasClass('disabled')) {
        return;
    }
    if ($(window.currentSong.songDiv).parent().parent().parent().hasClass('artist-album')) {
        b = []
        for (var x = 0; x != window.currentSong.songDiv.parent().parent().parent().parent().children('.artist-album').length; x++) {
            b.push($($('#artists').children('#al').children('.artist-album')[x]).children('.song-wrapper').children('tbody').children ('.song-row'));
        }
        t = ar_find(window.currentSong.songDiv, b);
        if (window.n_repeat == 0) {
            if (window.n_shuffle == 1) {
                n = $(b[Math.floor((Math.random() * b) + 0)]);
                if (n == $(window.currentSong.songDiv)) {
                    n = $(b[Math.floor((Math.random() * b) + 0)]);
                }
            }
            else {
                n = $(b[t + 1]);
            }
            if (n.height() == null) {
                $('#song-info-template').html('');
                $('#song-time').css('display', 'none');
                playf(false);
                $('#play').addClass ('disabled');
                $('#skip').addClass ('disabled');
                $('#back').addClass('disabled');
                return;
            }
        }
        else if (window.n_repeat == 1) {
            if (window.n_shuffle == 1) {
                n = $(b[Math.floor((Math.random() * b.length) + 0)]);
                if (n == $(window.currentSong.songDiv)) {
                    n = $(b[Math.floor((Math.random() * b) + 0)]);
                }
            }
            else {
                n = $(b[t + 1]);
            }
            if (n.height() == null && window.n_repeat == 1) {
                n = $(b[0]);
            }
        }
        else if (window.n_repeat == 2) {
            n = b[ar_find(window.currentSong.songDiv, b)];
        }
        song_click (n);
        return;
    }
    if (window.n_repeat == 0) {
        if (window.n_shuffle == 1) {
            n = $(window.currentSong.songDiv.parent().children ('.song-row')[Math.floor((Math.random() * window.currentSong.songDiv.parent().children ('.song-row').length) + 0)]);
            if (n == $(window.currentSong.songDiv)) {
                n = $(window.currentSong.songDiv.parent().children ('.song-row')[Math.floor((Math.random() * window.currentSong.songDiv.parent().children ('.song-row').length) + 0)]);
            }
        }
        else {
            n = $(window.currentSong.songDivNoClone).next ();
        }
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
        if (window.n_shuffle == 1) {
            n = $(window.currentSong.songDiv.parent().children ('.song-row')[Math.floor((Math.random() * window.currentSong.songDiv.parent().children ('.song-row').length) + 0)]);
            if (n == $(window.currentSong.songDiv)) {
                n = $(window.currentSong.songDiv.parent().children ('.song-row')[Math.floor((Math.random() * window.currentSong.songDiv.parent().children ('.song-row').length) + 0)]);
            }
        }
        else {
            n = $(window.currentSong.songDiv).next ();
        }
        if (n.height() == null && window.n_repeat == 1) {
            n = $(window.currentSong.songDiv).first().next(); // Skip the title row
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

function add_playlist (event) {
    //event.preventDefault();
    console.log (event.dataTransfer);
}

function add_to_playlist () {
    var id = null;
    for (var i = 0; i != window.playlists.playlists.length; i++) {
        var pl = window.playlists.playlists[i];
        if (pl.name == $('#playlist-drop-btn').text()) {
            id = pl.id;
        }
    }
    $.ajax({
        type: 'ADDTPL',
        url: '/{0}/{1}'.format ($(window.song_obj_right).data ('id'), id),
        success: function(){
            $.getJSON ( "data/playlists.json", function( json ) {
                window.playlists = json
                for (var i = 0; i != window.playlists.playlists.length; i++) {
                    $('#playlist-drop').append ("<li class='playlist-item truncate'><a href='#'>" + window.playlists.playlists[i].name + "</a></li>");
                }
                $('.playlist-item').click (function () {
                    $('#playlist-drop-btn').text ($(this).text());
                });
            });
        },
    });
}

function remove_from_playlist() {
    start_load ();
    $.ajax({
        type: 'RMFPL',
        url: '/{0}'.format ($(window.song_obj_right).data ('plid')),
        success: function(){
            $.getJSON ( "data/playlists.json?nocache=" + (new Date()).getTime(), function( json ) {
                window.playlists = json
                for (var i = 0; i != window.playlists.playlists.length; i++) {
                    $('#playlist-drop').append ("<li class='playlist-item truncate'><a href='#'>" + window.playlists.playlists[i].name + "</a></li>");
                }
                $('.playlist-item').click (function () {
                    $('#playlist-drop-btn').text ($(this).text());
                });
                parse_playlist (window.playlists.playlists[$('.playlist-wrapper').data('index')]);
                end_load();
            });
        },
    });
}

function remove () {
    start_load ();
    $.ajax({
        type: 'DELETE',
        url: '/{0}'.format ($(window.song_obj_right).data ('id')),
        success: function(){
            $.getJSON( "data/library.json?nocache=" + (new Date()).getTime(), function( json ) {
                parse_songs(json);
                window.songs = json;
            });
            $.getJSON( "data/albums.json?nocache=" + (new Date()).getTime(), function( json ) {
                window.albums = json
            });
            $.getJSON( "data/artists.json?nocache=" + (new Date()).getTime(), function( json ) {
                window.artists = json
            });
            $.getJSON( "data/playlists.json?nocache=" + (new Date()).getTime(), function( json ) {
                window.playlists = json
                for (var i = 0; i != window.playlists.playlists.length; i++) {
                    $('#playlist-drop').append ("<li class='playlist-item truncate'><a href='#'>" + window.playlists.playlists[i].name + "</a></li>");
                }
                $('.playlist-item').click (function () {
                    $('#playlist-drop-btn').text ($(this).text());
                });
            });
            end_load();
        },
    });
}

function perf_oauth () {
    $.ajax({
        type: 'GETOAUTHURL',
        url: '/',
        success: function(data){
            window.location.href = data;
        },
    });
}

function check_oauth () {
    $.ajax({
        type: 'CHECKOAUTH',
        url: '/',
        success: function(){
            ;
        },
        error: function () {
            perf_oauth ();
        }
    });
}

check_oauth ();

var ytsearchres = null;

function searchYT (search) {
    start_yt_load ();
    $.ajax({
        type: 'SEARCHYT',
        url: encodeURI(search),
        success: function(data){
            s = data.split ('\n');
            window.ytsearchres = {}
            window.ytsearchres.videos = []
            for (var i=0; i != s.length; i++) {
                $.getJSON('https://www.googleapis.com/youtube/v3/videos?id=' + s[i] + '&key=AIzaSyAofmivOMlh5VmMl0_AoTeDgOm8FOwCBOc&fields=items(id,snippet(title,channelTitle,thumbnails(default)))&part=snippet',function(p,status,xhr){
                    var buf = {};
                    console.log ('https://www.googleapis.com/youtube/v3/videos?id=' + s[i] + '&key=AIzaSyAofmivOMlh5VmMl0_AoTeDgOm8FOwCBOc&fields=items(id,snippet(title,channelTitle,thumbnails(default)))&part=snippet');
                    if (p.items[0] != undefined) {
                        buf.img = p.items[0].snippet.thumbnails.default.url
                        buf.url = p.items[0].id;
                        buf.title = p.items[0].snippet.title;
                        buf.author = p.items[0].snippet.channelTitle;
                        window.ytsearchres.videos.push (buf);
                        buf = {};
                        ytsearch_parse (window.ytsearchres);
                    }
                });
            }
            end_yt_load ();
        }
    });
}

function ytsearch_parse (struct) {
    $.get('templates/ytsearch.mst', function(template) {
        var rendered = Mustache.render(template, struct);
        $('#ytpl-list').html(rendered);
        $("#ytpl-list").animate({
                scrollTop: 0
            }, 0);
    });
}

function load_yt (url) {
    document.getElementById ('yt-vid').src = "https://www.youtube.com/embed/" + url;
    $('#ytpl-inner').css('transform', 'translateX(-620px)');
}

function ytdl () {
    document.getElementById ('yt-vid').src
}

function ytback () {
    $('#ytpl-inner').css('transform', 'translateX(0)');
}

var yt_load_b = null;

function start_yt_load () {
    $('#yt-load').css('display', 'block');
}

function end_yt_load () {
    $('#yt-load').css('display', 'none');
}

function hard_reload () {
    start_load ();
    $.ajax({
        type: 'RELOAD',
        url: '/',
        success: function(data){
            refresh();
            end_load();
        }
    });
}

function dis_0 () {
    $('.topcontent-wrapper').css ('transform', 'translateX(-0)');
    $('.other-buff').css ('display', 'none');
    $('.topcontent-wrapper').css ('display', 'flex');
    switch_top ('red', 'none');
}

function dis_1 () {
    $('.topcontent-wrapper').css ('transform', 'translateX(-100vw)');
    $('.other-buff').css ('display', 'none');
    $('.topcontent-wrapper').css ('display', 'flex');
    switch_top ('red', 'none');
}

function dis_2 () {
    $('.topcontent-wrapper').css ('transform', 'translateX(-200vw)');
    $('.other-buff').css ('display', 'none');
    $('.topcontent-wrapper').css ('display', 'flex');
    switch_top ('red', 'none');
}

function dis_3 () {
    $('.topcontent-wrapper').css ('transform', 'translateX(-300vw)');
    $('.other-buff').css ('display', 'none');
    $('.topcontent-wrapper').css ('display', 'flex');
    switch_top ('red', 'none');
}
