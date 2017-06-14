"use strict";
exports.__esModule = true;
var Tabs = (function () {
    function Tabs(app, ui) {
        var _this = this;
        this.dis_0 = function () {
            $('.topcontent-wrapper').css('transform', 'translateX(-0)');
            $('.other-buff').css('display', 'none');
            $('.topcontent-wrapper').css('display', 'flex');
            _this.ui.switch_top('red', 'none');
            _this.current = 0;
            _this.setBottom();
        };
        this.dis_1 = function () {
            $('.topcontent-wrapper').css('transform', 'translateX(-100vw)');
            $('.other-buff').css('display', 'none');
            $('.topcontent-wrapper').css('display', 'flex');
            _this.ui.switch_top('red', 'none');
            _this.current = 1;
            _this.setBottom();
        };
        this.dis_2 = function () {
            $('.topcontent-wrapper').css('transform', 'translateX(-200vw)');
            $('.other-buff').css('display', 'none');
            $('.topcontent-wrapper').css('display', 'flex');
            _this.ui.switch_top('red', 'none');
            _this.current = 2;
            _this.setBottom();
        };
        this.dis_3 = function () {
            $('.topcontent-wrapper').css('transform', 'translateX(-300vw)');
            $('.other-buff').css('display', 'none');
            $('.topcontent-wrapper').css('display', 'flex');
            _this.ui.switch_top('red', 'none');
            _this.current = 3;
            _this.setBottom();
        };
        this.setBottom = function () {
            document.querySelector('.home-tabs').select(_this.current);
        };
        this.app = app;
        this.current = 0;
        this.ui = ui;
    }
    return Tabs;
}());
exports.Tabs = Tabs;
