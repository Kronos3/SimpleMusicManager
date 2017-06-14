declare function require(name:string);
import {App} from './main'
import {IPC} from './ipc'
import * as UTIL from './util'
import {controls} from './controls'
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
        this.app = app;
        this.ipc = ipc;
        this.config = initConfig ();
        this.controls = new controls (this);
        $('.tooltipped').tooltip({delay: 2000});
        document.querySelector('#song-time').addEventListener('immediate-value-change', (e) => {
            this.songTimeChanging = true;
        });
        document.querySelector('#song-time').addEventListener('change', function(e) {;
            this.audio.currentTime = (<any>document.querySelector('#song-time')).value;
            this.songTimeChanging = false;
        });
        document.querySelector('#song-vol').addEventListener('immediate-value-change', function(e) {;
            this.audio.volume = ((<any>document.querySelector('#song-vol')).immediateValue / 100);
        });
        document.querySelector('#song-vol').addEventListener('change', function(e) {
            this.audio.volume = ((<any>document.querySelector('#song-vol')).value / 100);
        });

        this.initAudioEvents();
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
            this.ipc.requestSong (this.currentSong.id, (url) => {
                this.setSong (url);
                this.audio.currentTime = (<any>document.querySelector('#song-time')).value;
                this.controls.play (true);
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
        return (this.findSongIndex ($(el).data('id'), "id"));
    }

    findSongFromEl = (el: Element) => {
        return (this.metaSongs[this.findSongIndexFromEl(el)]);
    }

    findSongIndex = (attr: string, token: any): number => {
        for (var i = 0; i!=this.metaSongs.length; i++) {
            if (this.metaSongs[i][attr] == token) {
                return i;
            }
        }
    }
    
    findSong = (attr: string, token: any): metaSong => {
        return this.metaSongs[this.findSongIndex(attr, token)];
    }

    generateQueue (e: Element) {
        $(e).parent ().children ('.song-list').forEach(element => {
            this.queue.push(this.findSongFromEl(element.get(0)));
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
        ar.forEach(element => {
            if ($(element).data('id') == id) {
                return element;
            }
        });
        return null;
    }

    playSong = (song: metaSong) => {
        this.currentSongIndex = UTIL.find (song, this.metaSongs);
        this.currentSong = this.metaSongs[this.currentSongIndex];
        this.currentSongDiv = this.findSonginEl (this.currentSong.id, this.queueEl);
        this.ipc.requestSong (this.currentSong.id, (url) => {
            this.setSong (url);
            this.queueIndex = UTIL.find (this.currentSongDiv, this.queue);
            this.increment_song ();
        });
    }

    nextSong = () => {
        if ($('#next').hasClass ('disabled')) {
            return;
        }

        var n:number; // Buffer for queue index pointing to next song
        if (!this.controls.n_repeat) {
            if (this.controls.n_shuffle) {
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

    increment_song = () => {
         this.ipc.increment_song(this.currentSong.id);
    }
}