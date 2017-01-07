const remote = require('electron').remote;

var navOpened = 0;

 $(document).ready(function(){
    $('.tooltipped').tooltip({delay: 2000});
  });

function openNav() {
    "use strict";
    if (navOpened === 0) {
        $("#menu > i").css("color", "#212121");
        $("#menu").addClass("white");
        $("#menu").removeClass("red");
        $("#nav").css("left", "0px");
        $("#menu").css("color", "rgb(255, 255, 255)");
        $("#menu > i").text("close");
        navOpened = 1;
        $('.disable-nav').css('display', 'block');
        $('.disable-nav').css('z-index', '104');
    }
    else {
        $("#menu").addClass("red");
        $("#menu").removeClass("white");
        $("#menu > i").css("color", "#fff");
        $("#nav").css("left", "-280px");
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
        $('.top-search-inner').addClass("red")
        $('.top-search-inner').css('box-shadow', 'none');
        $('.search-icon').css('color', '#fff');
        $('.search').css('color', '#fff');
      })
      .focus(function() {
        $('.top-search-inner').removeClass("red");
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

function playf () {
    if (n_play === 0)
        {
            n_play = 1;
            $("#play > i").text ("pause");
        }
    else
        {
            n_play = 0;
            $("#play > i").text("play_arrow");
        }
    $('#play').toggleClass("paused");
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
    $("#menu").addClass("red");
    $("#menu").removeClass("white");
    $("#menu > i").css("color", "#fff");
    $("#nav").css("left", "-280px");
    $("#menu").css("color", "rgb(80, 77, 71)");
    $("#menu > i").text("menu");
    navOpened = 0;
    $('.disable-nav').css('display', 'none');
}

