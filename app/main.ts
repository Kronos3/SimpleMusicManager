declare function require(name:string);
declare var $;
import {SongController} from './songcontroller'
import {UI} from './ui'
import {IPC} from './ipc'
import {Login} from './login'
import {YouTubeAPI} from './youtube'

export class App {
    ipc: IPC;
    songcontroller: SongController;
    ui: UI;
    ytapi: YouTubeAPI;
    login: Login;
    constructor () {
        this.ipc = new IPC (this);
        this.songcontroller = new SongController (this, this.ipc);
        this.ui = new UI (this);
        this.ytapi = new YouTubeAPI (this);
        this.login = new Login (this);
    }
}

(<any>window).APP = null;

$(document).ready(() => {
    (<any>window).APP = new App ();
    document.onkeyup=function(e){
        if(e.which == 32) {
            (<any>window).APP.songcontroller.controls.play();
        }
    }
})