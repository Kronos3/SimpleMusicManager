import {App} from './main'
declare var $;

class GPSLogin {
    loginStatus: boolean;
    app: App;

    constructor (app: App) {
        this.loginStatus = false;
        this.app = app;
    }

    updateStatus = (callback?: (boolean) => void, refresh?: boolean) => {
        var saveData = $.ajax({
            type: 'POST',
            url: "/check_login",
            dataType: "text",
            success: (resultData) => { 
                this.close ();
                $('#sign-in').css ('display', 'none');
                this.loginStatus = true;
                if (typeof callback != 'undefined') {
                    callback (true);
                }
                if (refresh) {
                    this.app.ui.refresh ();
                }
            },
            error: () => {
                this.loginStatus = false;
                if (typeof callback != 'undefined') {
                    callback (false);
                }
            }
        });
    }

    login = () => { // Open login dialogue
        this.updateStatus ((status) => {
            if (!status) {
                $('.login').css('display', 'block');
                $('.disable').css('display', 'block');
                $('.disable').css('z-index', '104');
            }
        })
    }

    close = () => { // Close login dialogue
        $('.login').css('display', 'none');
        $('.disable').css('display', 'none');
        $('.disable').css('z-index', '-1');
    }
    
    loginRedirect = (url) => { //Handles oauth from GPS redirect (after login complete)
        if (url != "http://localhost:8001/oauth/"){
            this.close ();
            $('#sign-in').css ('display', 'none');
            this.loginStatus = true;
            this.app.ui.refresh();
        }
    }
}

class oauthLogin {
    loginStatus: boolean;
    constructor () {
        this.loginStatus = false;
    }

    updateStatus = () => {
        $.ajax({
            type: 'CHECKOAUTH',
            url: '/',
            success: () => {
                this.loginStatus = true;
            },
            error: () => {
                this.perform ();
                this.loginStatus = false;
            }
        });
    }

    perform = () => { // Request oauth url from IPC
        $.ajax({
            type: 'GETOAUTHURL',
            url: '/',
            success: function(data){
                console.log (data);
                window.open(data);
            },
        });
    }
}

export class Login {
    gps: GPSLogin;
    oauth: oauthLogin;
    app: App;

    constructor (app: App) {
        this.app = app;
        this.gps = new GPSLogin (this.app);
        this.oauth = new oauthLogin ();
        this.gps.updateStatus (() => {return}, true);
        this.oauth.updateStatus ();
    }
}