import {App} from './main'
import {UI} from './ui'
declare var $;

export class Tabs {
    app: App;
    current: number;
    ui: UI;
    constructor (app: App, ui: UI) {
        this.app = app;
        this.current = 0;
        this.ui = ui;
    }

    dis_0 = () => {
        $('.topcontent-wrapper').css ('transform', 'translateX(-0)');
        $('.other-buff').css ('display', 'none');
        $('.topcontent-wrapper').css ('display', 'flex');
        this.ui.switch_top ('red', 'none');
        this.current = 0;
        this.setBottom ();
    }

    dis_1 = () => {
        $('.topcontent-wrapper').css ('transform', 'translateX(-100vw)');
        $('.other-buff').css ('display', 'none');
        $('.topcontent-wrapper').css ('display', 'flex');
        this.ui.switch_top ('red', 'none');
        this.current = 1;
        this.setBottom ();
    }

    dis_2 = () => {
        $('.topcontent-wrapper').css ('transform', 'translateX(-200vw)');
        $('.other-buff').css ('display', 'none');
        $('.topcontent-wrapper').css ('display', 'flex');
        this.ui.switch_top ('red', 'none');
        this.current = 2;
        this.setBottom ();
    }

    dis_3 = () => {
        $('.topcontent-wrapper').css ('transform', 'translateX(-300vw)');
        $('.other-buff').css ('display', 'none');
        $('.topcontent-wrapper').css ('display', 'flex');
        this.ui.switch_top ('red', 'none');
        this.current = 3;
        this.setBottom ();
    }

    setBottom = () => {
        (<any>document.querySelector('.home-tabs')).select(this.current);
    }
}