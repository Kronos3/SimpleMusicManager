declare function require(name:string);
import {App} from './main'
var $ = require("jquery");

export class IPC {
    app: App;
    constructor (app: App) {
        this.app = app;
    }

    requestSong = (id: string, finished: (s: string) => void) => {
        this.urlExists(id, (status) => {
            if (!status) {
                var saveData = $.ajax ({
                    type: 'STREAM',
                    url: "/" + id,
                    dataType: "type",
                    success: (resultData) => {
                        finished (resultData);
                    }
                });
            }
        });
    } 

    urlExists = (url, callback) => {
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
}
