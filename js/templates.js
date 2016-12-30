/* The following is a set of templates that will
 * make up the content of the page
 * Templates here will be sent back to the RPC
 * via import
 */

var mustache = require('mustache');
var fs = require("fs");
var colorThief = new ColorThief();

function add_card (card) {
    fs.readFile('templates/now.html', "utf-8", function(err, template) {
        var html = mustache.to_html(template, card);
        $(html).appendTo("#content-wrapper");
    });
}

function now_cards (list) {
    for (x in list) {
        add_card(list[x]);
    }
}

String.prototype.format = String.prototype.f = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};
