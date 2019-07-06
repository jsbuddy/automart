class Form {
  constructor(form, message) {
    this.form = form;
    this.message = message;
  }

  handle(e) {
  }

  disableForm() {
    [...this.form].forEach(el => {
      el.name === 'submit' && el.classList.add('loading');
      el.disabled = true;
    })
  }

  enableForm() {
    [...this.form].forEach(el => {
      el.name === 'submit' && el.classList.remove('loading');
      el.disabled = false;
    })
  }

  showMessage(message, _class) {
    this.message.textContent = message;
    this.message.className = `message mt-2 ${_class}`;
    this.message.style.display = 'block';
  }

  hideMessage() {
    this.message.textContent = '';
    this.message.style.display = 'none';
  }

  prefill(data) {
    [...this.form].forEach(el => {
      el.value = data[el.name];
    });
  }
}