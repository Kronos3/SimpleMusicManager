import {App} from "./main"
declare function require(name:string);
var $ = require("jquery");

export class UI {
    app: App;
    constructor (app: App) {
        this.app = app;
            $('.search').blur(() => {
            $(this).parent('.top-search-inner').removeClass("white");
            $(this).parent('.top-search-inner').addClass("with-back");
            $(this).parent('.top-search-inner').css('box-shadow', 'none');
            $(this).prev('.search-icon').css('color', '#fff');
            $(this).css('color', '#fff');
        })
      .focus(() => {
            $(this).parent('.top-search-inner').removeClass("with-back");
            $(this).parent('.top-search-inner').removeClass("red");
            $(this).parent('.top-search-inner').addClass("white");
            $(this).parent('.top-search-inner').css('box-shadow', '0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.4)');
            $(this).parent('.top-search-inner').addClass("white");
            $(this).prev('.search-icon').css('color', '#424242');
            $(this).css('color', '#424242');
        });
    }

    get = (s: string) => {
        return document.querySelector (s);
    }
}