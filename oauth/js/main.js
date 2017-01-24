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
        data: {login:$('#email').val(), passwd:$('#passwd').val(), save:$("#savep").val()},
        dataType: "text",
        success: function(resultData) { 
            $('.wrongpass').css('display', 'none');
            window.location.replace("http://localhost:8000/oauth/redirect.html");
        }
    });
    saveData.error(function() { $('.wrongpass').css('display', 'block'); });
}
