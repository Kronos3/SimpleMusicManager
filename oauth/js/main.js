String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

function __login(){
    var saveData = $.ajax({
        type: 'POST',
        url: "/login",
        data: {login:$('#email').val(), passwd:$('#passwd').val()},
        dataType: "text",
        success: function(resultData) { $('.wrongpass').css('display', 'none'); }
    });
    saveData.error(function() { $('.wrongpass').css('display', 'block'); });
}
