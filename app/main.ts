declare function require(name:string);
import * as $ from 'jquery';
import {SongController} from './songcontroller'
import {IPC} from './ipc'

export class App {
    ipc: IPC;
    songcontroller: SongController;
    constructor () {
        this.ipc = new IPC (this);
        this.songcontroller = new SongController (this, this.ipc);
    }
    
}

$(document).ready(function(){
    (<any>window).APP = new App ();
});