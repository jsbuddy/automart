/* eslint-disable */
class ModalController {
    constructor(el) {
        this.el = el;
        this.closeTrigger = this.el.querySelector('.trigger-close');
    }
    show = () => {
        this.changeElClass('add', 'show');
        this.addCloseTriggerEvent();
    }
    close = () => {
        this.changeElClass('remove', 'show');
        this.removeCloseTriggerEvent();
    }
    changeElClass = (action, _class) => {
        this.el.classList[action](_class);
    }
    addCloseTriggerEvent = () => {
        this.closeTrigger.addEventListener('click', this.close);
    }
    removeCloseTriggerEvent = () => {
        this.closeTrigger.removeEventListener('click', this.close);
    }
}

