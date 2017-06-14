"use strict";
exports.__esModule = true;
var GPSLogin = (function () {
    function GPSLogin(app) {
        var _this = this;
        this.updateStatus = function (callback, refresh) {
            var saveData = $.ajax({
                type: 'POST',
                url: "/check_login",
                dataType: "text",
                success: function (resultData) {
                    _this.close();
                    $('#sign-in').css('display', 'none');
                    _this.loginStatus = true;
                    if (typeof callback != 'undefined') {
                        callback(true);
                    }
                    if (refresh) {
                        _this.app.ui.refresh();
                    }
                },
                error: function () {
                    _this.loginStatus = false;
                    if (typeof callback != 'undefined') {
                        callback(false);
                    }
                }
            });
        };
        this.login = function () {
            _this.updateStatus(function (status) {
                if (!status) {
                    $('.login').css('display', 'block');
                    $('.disable').css('display', 'block');
                    $('.disable').css('z-index', '104');
                }
            });
        };
        this.close = function () {
            $('.login').css('display', 'none');
            $('.disable').css('display', 'none');
            $('.disable').css('z-index', '-1');
        };
        this.loginRedirect = function (url) {
            if (url != "http://localhost:8001/oauth/") {
                _this.close();
                $('#sign-in').css('display', 'none');
                _this.loginStatus = true;
                _this.app.ui.refresh();
            }
        };
        this.loginStatus = false;
        this.app = app;
    }
    return GPSLogin;
}());
var oauthLogin = (function () {
    function oauthLogin() {
        var _this = this;
        this.updateStatus = function () {
            $.ajax({
                type: 'CHECKOAUTH',
                url: '/',
                success: function () {
                    _this.loginStatus = true;
                },
                error: function () {
                    _this.perform();
                    _this.loginStatus = false;
                }
            });
        };
        this.perform = function () {
            $.ajax({
                type: 'GETOAUTHURL',
                url: '/',
                success: function (data) {
                    console.log(data);
                    window.open(data);
                }
            });
        };
        this.loginStatus = false;
    }
    return oauthLogin;
}());
var Login = (function () {
    function Login(app) {
        this.app = app;
        this.gps = new GPSLogin(this.app);
        this.oauth = new oauthLogin();
        this.gps.updateStatus(function () { return; }, true);
        this.oauth.updateStatus();
    }
    return Login;
}());
exports.Login = Login;
