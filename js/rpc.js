/* The following is a set of templates that will
 * make up the content of the page
 * Templates here will be sent back to the RPC
 * via import
 */

var zerorpc = require("zerorpc");

var exec = require('child_process').exec;

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};

// call the function
execute('python ./python/r_handler.py', function(output) {
    console.log(output);
});

var client = new zerorpc.Client();
client.connect("tcp://127.0.0.1:4242");

const BrowserWindow = remote.BrowserWindow;
var win = new BrowserWindow({ width: 800, height: 600 });
function refresh () {
    client.invoke("refresh", 0, function(error, res, more) {
        //signal.trigger("got_refresh", res);
    });
}

function login () {
    client.invoke("login", [$('#email').val(),$('#passwd').val()], function(error, res, more) {
        //signal.trigger("got_login", res);
    });
}

function get_auth () {
    client.invoke("get_auth", '', function(error, res, more) {
        win.loadURL(res);
    });
}

function open_login () {
    $('.login').css('display', 'block');
    $('.disable').css('display', 'block');
    get_auth();
}

function login_close() {
    $('.login').css('display', 'none');
    $('.disable').css('display', 'none');
}
