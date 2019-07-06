/* eslint-disable */

class ModalController {
  constructor(el) {
    this.el = el;
    this.closeTrigger = this.el.querySelector('.trigger-close');
  }

  show = () => {
    this.#changeElClass('add', 'show');
    this.#addCloseTriggerEvent();
  };

  preClose = () => {};

  close = () => {
    this.preClose();
    this.#changeElClass('remove', 'show');
    this.#removeCloseTriggerEvent();
  };

  #changeElClass = (action, _class) => {
    this.el.classList[action](_class);
  };

  #addCloseTriggerEvent = () => {
    this.closeTrigger.addEventListener('click', this.close);
  };

  #removeCloseTriggerEvent = () => {
    this.closeTrigger.removeEventListener('click', this.close);
  }
}

window.addEventListener('click', (e) => {
  let modal;
  if (e.target.classList.contains('modal-trigger')) {
    modal = document.getElementById(e.target.dataset.id);
  } else {
    const el = [...e.path].find((el) => el.classList && el.classList.contains('modal-trigger'));
    modal = el && document.getElementById(el.dataset.id);
  }
  if (modal) {
    const controller = new ModalController(modal);
    controller.show();
  }
});
