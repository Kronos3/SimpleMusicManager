declare function require(name:string);
import {App} from './main'
import {IPC} from './ipc'
var $ = require("jquery");
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

export class Song {
    object: Element;
    name: string;
    artist: string;
    album: string;
    metaObj: metaSong;
    controller: SongController;
    constructor (controller: SongController, e: Element) {
        this.object = e;
        this.controller = controller;
        this.metaObj = this.controller.findSongFromEl (this.object);
        this.name = this.metaObj.title;
        this.artist = this.metaObj.artist;
        this.album = this.metaObj.album;
    }

    play = () => {

    }
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

class controls { // Handles UI portion of song playing
    

}

export class SongController {
    currentSong: metaSong;
    metaSongs: metaSong[] // Generated from list recieved from Python
    audio: HTMLAudioElement;
    app: App;
    songTimeChanging: boolean;

    /* Settings */
    config: controllerConfig;
    ipc: IPC;

    constructor (app: App, ipc: IPC) {
        this.audio = new Audio;
        this.app = app;
        this.ipc = ipc;
        this.config = initConfig ();
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
        
    }

    setSong = (url: string) => {
        this.audio.src = url;
    }

    playSong = (el) => {
        this.currentSong = this.findSongFromEl (el);
        this.ipc.requestSong (this.currentSong.id, (url) => {
            this.setSong (url);
        });
    }
}