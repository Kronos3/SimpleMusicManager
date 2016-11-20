/* The following is a set of templates that will
 * make up the content of the page
 * Templates here will be sent back to the RPC
 * via import
 */

var zerorpc = require("zerorpc");
var signal = require('signal-js');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var oauth2Client = new OAuth2(
  '653251527309-g0bbun3n029bghmrbhaa9c1sbvubusep.apps.googleusercontent.com',
  'JmnwJYoEtR9uhTeAQLiCqmx_',
  '#'
);

var client = new zerorpc.Client();
client.connect("tcp://127.0.0.1:4242");

signal.on('refresh', function(arg) {
    client.invoke("refresh", 0, function(error, res, more) {
        signal.trigger("r_refresh", res);
    });
});
signal.on('login', function(arg) {
    client.invoke("login", [$('#email'),$('#passwd')], function(error, res, more) {
        signal.trigger("r_login", res);
    });
});

function open_login () {
    $('.login').css('display', 'block');
    $('.disable').css('display', 'block');
}

function login_close() {
    $('.login').css('display', 'none');
    $('.disable').css('display', 'none');
}
