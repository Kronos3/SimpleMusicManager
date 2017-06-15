"use strict";
exports.__esModule = true;
var Mustache = require("mustache");
var YouTubeAPI = (function () {
    function YouTubeAPI(app) {
        var _this = this;
        this.loadStart = function () {
            $('#yt-load').css('display', 'block');
        };
        this.loadEnd = function () {
            $('#yt-load').css('display', 'none');
        };
        this.search = function (token) {
            _this.loadStart();
            $.ajax({
                type: 'SEARCHYT',
                url: encodeURI(token),
                success: function (data) {
                    var s;
                    s = data.split('\n');
                    for (var i = 0; i != s.length; i++) {
                        $.getJSON('https://www.googleapis.com/youtube/v3/videos?id=' + s[i] + '&key=AIzaSyAofmivOMlh5VmMl0_AoTeDgOm8FOwCBOc&fields=items(id,snippet(title,channelTitle,thumbnails(default)))&part=snippet', function (p, status, xhr) {
                            if (p.items[0] != undefined) {
                                var buf = {
                                    img: p.items[0].snippet.thumbnails["default"].url,
                                    url: p.items[0].id,
                                    title: p.items[0].snippet.title,
                                    author: p.items[0].snippet.channelTitle
                                };
                                _this.results.push(buf);
                                _this.parse(_this.results);
                            }
                            if (i == s.length) {
                                _this.loadEnd();
                            }
                        });
                    }
                }
            });
        };
        this.parse = function (struct) {
            $.get('templates/ytsearch.mst', function (template) {
                var obj = {};
                obj.videos = struct;
                var rendered = Mustache.render(template, obj);
                $('#ytpl-list').html(rendered);
                $("#ytpl-list").animate({
                    scrollTop: 0
                }, 0);
            });
        };
        this.loadVid = function (url) {
            if (url != _this.currentURL) {
                _this.currentURL = url;
                document.querySelector('#yt-vid').src = "http://www.youtube.com/embed/" + _this.currentURL;
            }
            $('#ytpl-inner').css('transform', 'translateX(-620px)');
            $('#ytdl').css('display', 'block', 'important');
        };
        this.back = function () {
            $('#ytpl-inner').css('transform', 'translateX(0)');
            $('#ytdl').css('display', 'none');
        };
        this.app = app;
        this.results = [];
        $('#ytsearch').keypress(function (e) {
            if (e.which == 13) {
                window.APP.ytapi.search($(this).val());
            }
        });
    }
    return YouTubeAPI;
}());
exports.YouTubeAPI = YouTubeAPI;
