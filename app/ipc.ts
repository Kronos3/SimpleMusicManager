declare function require(name:string);
import {App} from './main'
import * as UTIL from './util'
declare var $;

export class IPC {
    app: App;
    constructor (app: App) {
        this.app = app;
    }

    requestSong = (id: string, _context: Object, finished: (s: string, context: Object) => void) => {
        var saveData = $.ajax ({
            type: 'STREAM',
            url: "/" + id,
            success: (resultData) => {
                finished(resultData, _context);
            }
        });
    } 

    urlExists = (url: string, callback: (boolean) => void) => {
        $.ajax({
            type: 'HEAD',
            url: url,
            success: function(){
                callback(true);
            },
            error: function() {
                callback(false);
            }
        });
    }

    check_oauth = (callback: (boolean) => void) => {
        $.ajax({
            type: "CHECKOAUTH",
            url: "/",
            success: () => {
                callback(true);
            },
            error: () => {
                callback(false);
            }
        });
    }

    increment_song = (id:string, callback = ()=> {return}) => {
        $.ajax({
            type: "INC",
            url: "/{0}".format (id),
            success: () => {
                callback();
            },
            error: () => {
                callback();
            }
        });
    }
}
