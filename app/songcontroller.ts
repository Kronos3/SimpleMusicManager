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

class Song {
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

class SongController {
    currentSong: Element;
    metaSong: metaSong[] // Generated from list recieved from Python
    audio: Object;
    constructor () {
        this.audio = new Audio;
    }

    findSongIndexFromEl = (el: Element) => {
        return (this.findSongIndex ($(el).data('id'), "id"));
    }

    findSongFromEl = (el: Element) => {
        return (this.metaSong[this.findSongIndexFromEl(el)]);
    }

    findSongIndex = (attr: string, token: any): number => {
        for (var i = 0; i!=this.metaSong.length; i++) {
            if (this.metaSong[i][attr] == token) {
                return i;
            }
        }
    }
    
    findSong = (attr: string, token: any): metaSong => {
        return this.metaSong[this.findSongIndex(attr, token)];
    }

    generateQueue (e: Element) {
        
    }
}
