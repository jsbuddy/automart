// eslint-disable-next-line no-unused-vars
class ModalController {
    constructor(el) {
        this.el = el;
        this.closeTrigger = this.el.querySelector('.trigger-close');
    }
    show() {
        this.el.classList.add('show');
        this.closeTrigger.addEventListener('click', this.close);
    }
    close() {
        this.el.classList.remove('show');
        this.closeTrigger.removeEventListener('click', this.close);
    }
}
