/* The following is a set of templates that will
 * make up the content of the page
 * Templates here will be sent back to the RPC
 * via import
 */


var net = require('net');
var client = new net.Socket();
client.connect(8000);

client.on('data', function(data) {
    ret = String(data).split("|");
    eval("got_{0}({1})".f(ret[0], ret[1]));
});

function r_now () {
    client.write('r_now');
}

function got_now (t) {
    now_cards(JSON.parse(fs.readFileSync('data/now.json', 'utf8')));
}

function got_check_login(t) {
    if (t == true) {
        $('#sign-in').css('display', 'none');
    }
}

function got_login(status) {
    if (JSON.parse(status) == false) {
        $('.wrongpass').css('display', 'block');
    }
    else
    {
        login_close()
        $('#passwd').val('');
    }
}

function get_auth () {
    client.invoke("get_auth", '', function(error, res, more) {
        win.loadURL(res);
    });
}

function open_login () {
    $('.login').css('display', 'block');
    $('.disable').css('display', 'block');
    $('.disable').css('z-index', '104');
}

function login_close() {
    $('.login').css('display', 'none');
    $('.disable').css('display', 'none');
    $('.disable').css('z-index', '-1');
}
