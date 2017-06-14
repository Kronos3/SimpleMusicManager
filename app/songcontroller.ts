declare function require(name:string);
import {App} from './main'
import {IPC} from './ipc'
import * as UTIL from './util'
import {controls} from './controls'
var Mustache = require ("mustache");
declare var $;

interface artRef {
    kind?: string;
    url?: string;
    aspectRatio?: string;
    autogen?: boolean;
}

interface metaSong {
    albumArtRef: artRef[];
    albumArtist: string;
    year: number,
    genre: string,
    artistArtRef: artRef[];
    kind: string,
    id: string,
    clientId: string,
    creationTimestamp: string,
    lastModifiedTimestamp: string,
    recentTimestamp: string,
    deleted: boolean,
    title: string,
    artist: string,
    composer: string,
    album: string,
    comment?: string,
    trackNumber: number,
    durationMillis: string,
    beatsPerMinute: number,
    playCount: number,
    totalTrackCount: number,
    discNumber: number,
    totalDiscCount: number,
    rating: string,
    estimatedSize: string,
    storeId: string,
    albumId: string,
    artistId: string[],
    nid: string,
    minutes: string,
    image: string, // url
    songnum: number
}

export interface controllerConfig {
    cacheStream: boolean; // Cache all songs that are stream
    cacheMeta: boolean; // Cache meta data such as artist images
    cachePath: string; // Directory where cache is saved
    songPath: string; // Directory where downloaded songs are saved
}

function initConfig (): controllerConfig {
    return {
        cacheStream: false,
        cacheMeta: true,
        cachePath: '.cache',
        songPath: '~/Music/SMM'
    }
}

export class SongController {
    currentSong: metaSong;
    currentSongIndex: number;
    currentSongDiv: Element;
    metaSongs: metaSong[] // Generated from list recieved from Python
    queue: metaSong[];
    queueEl: Element[];
    queueIndex: number;
    audio: HTMLAudioElement;
    app: App;
    songTimeChanging: boolean;

    /* Settings */
    config: controllerConfig;
    ipc: IPC;
    controls: controls;

    constructor (app: App, ipc: IPC) {
        this.audio = new Audio;
        this.audio.volume = 0.5;
        this.app = app;
        this.ipc = ipc;
        this.config = initConfig ();
        this.controls = new controls (this);
        $('.tooltipped').tooltip({delay: 2000});
        document.querySelector('#song-time').addEventListener('immediate-value-change', (e) => {
            this.songTimeChanging = true;
        });
        document.querySelector('#song-time').addEventListener('change', (e) => {;
            this.audio.currentTime = (<any>document.querySelector('#song-time')).value;
            this.songTimeChanging = false;
        });
        document.querySelector('#song-vol').addEventListener('immediate-value-change', (e) => {;
            this.audio.volume = ((<any>document.querySelector('#song-vol')).immediateValue / 100);
        });
        document.querySelector('#song-vol').addEventListener('change', (e) => {
            this.audio.volume = ((<any>document.querySelector('#song-vol')).value / 100);
        });

        this.queue = [];
        this.queueEl = [];

        this.initAudioEvents();
    }

    genMetaFromRaw = (struct) => {
        this.metaSongs = [];
        struct.songs.forEach((song) => {
            this.metaSongs.push (<metaSong>song);
        });
    }

    initAudioEvents = () => {
        this.audio.addEventListener('progress', function() {
            // this = this.audio
            try {
                var bufferedEnd = this.buffered.end(this.buffered.length - 1);
            }
            catch (err) {
                bufferedEnd = (<any>document.querySelector('#song-time')).secondaryProgress;
            }
            var duration =  this.duration;
            (<any>document.querySelector('#song-time')).secondaryProgress = bufferedEnd;
        });

        this.audio.addEventListener('error', () => {
            this.ipc.requestSong (this.currentSong.id, this, (url, __this) => {
                (<any>__this).setSong (url);
                (<any>__this).audio.currentTime = (<any>document.querySelector('#song-time')).value;
                (<any>__this).controls.play (true);
            });
        });

        this.audio.addEventListener('timeupdate', () => {
            var duration = this.audio.duration;
            try {
                (<any>document.querySelector('#song-time')).max = duration;
            }
            catch (err) 
            {
                ;
            }
            if (duration > 0) {
                if (!this.songTimeChanging) {
                    (<any>document.querySelector('#song-time')).value = this.audio.currentTime;
                }
            }
        });

        this.audio.onended = () => {
            this.nextSong ();
        };
    }

    findSongIndexFromEl = (el: Element) => {
        return (this.findSongIndexID ($(el).data('id')));
    }

    findSongFromEl = (el: Element) => {
        return (this.metaSongs[this.findSongIndexFromEl(el)]);
    }

    findSongIndexID = (token: any): number => {
        for (var i = 0; i!=this.metaSongs.length; i++) {
            if (this.metaSongs[i].id == token) {
                return i;
            }
        }
    }

    generateQueue (e: Element) {
        $(e).parent ().children ('.song-list').toArray().forEach((element) => {
            this.queue.push(this.findSongFromEl(element));
            this.queueEl.push (element);
        });
    }

    setSong = (url: string) => {
        this.audio.src = url;
    }

    songClick = (el: Element) => {
        this.generateQueue (el);
        this.playSong (this.findSongFromEl (el));
    }

    findSonginEl = (id: string, ar: Element[]): Element => {
        for (var i = 0; i != ar.length; i++) {
            if ($(ar[i]).data('id') == id) {
                return ar[i];
            }
        }
        return null;
    }

    findSongIndexinEl = (id: string, ar: Element[]): number => {
        for (var i = 0; i != ar.length; i++) {
            if ($(ar[i]).data('id') == id) {
                return i;
            }
        }
        return -1;
    }

    playSong = (song: metaSong) => {
        $('#play').removeClass ('disabled');
        $('#back').removeClass ('disabled');
        $('#skip').removeClass ('disabled');
        if (this.currentSongDiv != undefined)
        $(this.currentSongDiv).children('.tbl-num').children('span').css('background-image', 'url({0})'.format (this.currentSong.albumArtRef[0].url));
        this.currentSongIndex = UTIL.find (song, this.metaSongs);
        this.audio.currentTime = 0;
        this.currentSong = this.metaSongs[this.currentSongIndex];
        this.currentSongDiv = this.findSonginEl (this.currentSong.id, this.queueEl);
        this.queueIndex = this.findSongIndexinEl (this.currentSong.id, this.queueEl);
        this.parseInfo();
        this.ipc.requestSong (this.currentSong.id, this, (url, __this) => {
            (<any>__this).setSong (url);
            (<any>__this).increment_song ();
            (<any>__this).controls.play (true);
        });
    }

    nextSong = () => {
        if ($('#next').hasClass ('disabled')) {
            return;
        }

        var n:number; // Buffer for queue index pointing to next song
        if (this.controls.n_repeat == 0) {
            if (this.controls.n_shuffle == 1) {
                n = Math.floor((Math.random() * this.queue.length) + 0);
            }
            else {
                n = this.queueIndex + 1;
            }
            if ($(this.queueEl[n]).height() == null) {
                $('#song-info-template').html('');
                $('#song-time').css('display', 'none');
                this.controls.play(false);
                $('#play').addClass ('disabled');
                $('#skip').addClass ('disabled');
                $('#back').addClass('disabled')
                return;
            }
        }
        else if (this.controls.n_repeat == 1) {
            if (this.controls.n_shuffle == 1) {
                n = Math.floor((Math.random() * this.queue.length) + 0);
            }
            else {
                n = this.queueIndex + 1;
            }
            if ($(this.queueEl[n]).height() == null) {
                n = 0;
            }
        }
        else if (this.controls.n_repeat == 2) {
            n = this.queueIndex;
        }
        this.playSong (this.queue[n]);
    }

    prevSong = () => {
        if ($('#back').hasClass('disabled')) {
            return;
        }
        if (this.audio.currentTime > 5) { // Restart the song 
            this.audio.currentTime = 0;
        }
        else { // Go back one song
            var n:number = this.queueIndex - 1;
            if (n < 0) {
                n = 0;
            }
            this.audio.currentTime = 0;
            this.playSong (this.queue[n]);
        }
    }

    parseInfo = () => { // Put the info in the bottom left
        $.get('templates/songinfo.mst', (template) => {
            var rendered = Mustache.render(template, this.currentSong);
            $('#song-info-template').html(rendered);
        });
        $('#song-time').css('display', 'block');
    }

    increment_song = () => {
         this.ipc.increment_song(this.currentSong.id);
         $(this.currentSongDiv).children('.tbl-plays').text (parseInt($(this.currentSongDiv).children('.tbl-plays').text()) + 1);
    }
}