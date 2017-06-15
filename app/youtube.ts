import {App} from "./main"
declare function require(name:string);
var Mustache = require ("mustache");
declare var $;

interface YTResult {
    img: string;
    url: string;
    title: string;
    author: string;
}

export class YouTubeAPI {
    app: App;
    results: YTResult[];
    constructor (app: App) {
        this.app = app;
        this.results = [];
        $('#ytsearch').keypress(function (e) {
            if (e.which == 13) {
                (<any>window).APP.ytapi.search ($(this).val());
            }
        });
    }

    loadStart = () => {
        $('#yt-load').css('display', 'block');
    }

    loadEnd = () => {
        $('#yt-load').css('display', 'none');
    }

    search = (token) => {
        this.loadStart ();
        $.ajax({
            type: 'SEARCHYT',
            url: encodeURI(token),
            success: (data) => {
                var s;
                s = data.split ('\n');
                for (var i=0; i != s.length; i++) {
                    $.getJSON('https://www.googleapis.com/youtube/v3/videos?id=' + s[i] + '&key=AIzaSyAofmivOMlh5VmMl0_AoTeDgOm8FOwCBOc&fields=items(id,snippet(title,channelTitle,thumbnails(default)))&part=snippet', (p,status,xhr) => {
                        if (p.items[0] != undefined) {
                            var buf:YTResult = {
                                img: p.items[0].snippet.thumbnails.default.url,
                                url: p.items[0].id,
                                title: p.items[0].snippet.title,
                                author: p.items[0].snippet.channelTitle
                            };
                            this.results.push (buf);
                            this.parse (this.results);
                        }
                        if (i == s.length) {
                            this.loadEnd ();
                        }
                    });
                }
            }
        });
    }

    parse = (struct) => {
        $.get('templates/ytsearch.mst', (template) => {
            var obj = {};
            (<any>obj).videos = struct;
            var rendered = Mustache.render(template, obj);
            $('#ytpl-list').html(rendered);
            $("#ytpl-list").animate({
                    scrollTop: 0
                }, 0);
        });
    }

    currentURL: string;

    loadVid = (url:string) => {
        if (url != this.currentURL) {
            this.currentURL = url;
            (<any>document.querySelector ('#yt-vid')).src = "http://www.youtube.com/embed/" + this.currentURL;
        }
        $('#ytpl-inner').css('transform', 'translateX(-620px)');
        $('#ytdl').css('display', 'block', 'important');
    }

    back = () => {
        $('#ytpl-inner').css('transform', 'translateX(0)');
        $('#ytdl').css('display', 'none');
    }
}