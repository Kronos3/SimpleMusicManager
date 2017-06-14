declare function require(name:string);
import {App} from './main'
import {IPC} from './ipc'
import * as UTIL from './util'
declare var $;
import {SongController} from './songcontroller'

export class controls { // Handles UI portion of song playing
    n_repeat: number = 0;
    n_shuffle: number = 0;
    n_play: number = 0;
    controller: SongController;

    constructor (controller: SongController) {
        this.controller = controller;
    }

    repeat = () => {
        if (this.n_repeat != 2) {
            this.n_repeat = this.n_repeat + 1;
        }
        else {
            this.n_repeat = 0;
        }
        if (this.n_repeat == 0) {
            $("#repeat").css ("color", "#424242");
            $("#repeat > i").text ("repeat");
        }
        else if (this.n_repeat == 1) {
            $("#repeat").css ("color", "#ef5350");
            $("#repeat > i").text ("repeat");
        }
        else if (this.n_repeat == 2) {
            $("#repeat > i").text("repeat_one");
        }
    }

    shuffle = () => {
        if (this.n_shuffle) {
            this.n_shuffle = 0;
            $("#shuffle").css ("color", "#424242");
        }
        else {
            this.n_shuffle = 1;
            $("#shuffle").css ("color", "#ef5350");
        }
    }

    play = (__play) => {
        if ($('#play').hasClass('disabled')){
            $(this.controller.currentSongDiv).children('.tbl-num').children('span').css('background-image', "url(''");
            return;
        }
        if (__play==undefined){
            if (this.n_play === 0)
                {
                    this.n_play = 1;
                    $("#play > i").text ("pause");
                    this.controller.audio.play ();
                    $(this.controller.currentSongDiv).children('.tbl-num').children('.song-number').css ('color', 'rgba(255,255,255,0)');
                    $(this.controller.currentSongDiv).children('.tbl-num').children('span').css('background-image', "url('img/playing.gif')");
                }
            else
                {
                    this.n_play = 0;
                    $("#play > i").text("play_arrow");
                    this.controller.audio.pause ();
                    $(this.controller.currentSongDiv).children('.tbl-num').children('.song-number').css ('color', 'rgba(255,255,255,0)');
                    $(this.controller.currentSongDiv).children('.tbl-num').children('span').css('background-image', "url('img/paused.png')");
                }
            $('#play').toggleClass("paused");
        }
        else if (__play) {
            this.n_play = 1;
            $("#play > i").text ("pause");
            this.controller.audio.play ();
            $(this.controller.currentSongDiv).children('.tbl-num').children('.song-number').css ('color', 'rgba(255,255,255,0)');
            $(this.controller.currentSongDiv).children('.tbl-num').children('span').css('background-image', "url('img/playing.gif')");
            $('#play').removeClass("paused");
        }
        else if (!__play) {
            this.n_play = 0;
            $("#play > i").text("play_arrow");
            this.controller.audio.pause ();
            $(this.controller.currentSongDiv).children('.tbl-num').children('.song-number').css ('color', 'rgba(255,255,255,0)');
            $(this.controller.currentSongDiv).children('.tbl-num').children('span').css('background-image', "url('img/paused.png')");
        }
    }
}