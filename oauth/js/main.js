String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

function enc_pass(user, pass)
{
    if (user == "" || pass == "")
    {
        return "user={0}\\pass={1}\\save=1".format ("placeholder", "passholder");
    }
    return "user={0}\\pass={1}\\save=1".format (user, pass);
}

function __login(){
    $.ajax({
    type: "POST",
    url: "{0}login".format (window.location.href),
    data: enc_pass($("#email").val(), $("#passwd").val()),
    success: function(msg){
            $('.wrongpass').css("display", "none");
            $("body").css("display", "none");
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
        if (errorThrown == "Bad Request")
        {
            //login();
        }
        if (errorThrown == "Unauthorized")
         {
            $('.wrongpass').css("display", "block");
        }
    }
});
}
