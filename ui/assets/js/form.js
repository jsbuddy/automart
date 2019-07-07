class Form {
  constructor(form, message) {
    this.form = form;
    this.message = message;
    this.err = false;
  }

  handle(e) {
    //..
  }

  submit(e) {
    e.preventDefault();
    this.hideMessage();
    this.handle(message => {
      message && this.showMessage(message, 'success');
      this.enableForm();
      this.form.reset();
    });
  }

  getFieldValue(name) {
    return [...this.form].find(el => el.name === name).value
  }

  getValuesAsObject() {
    return [...this.form].reduce((obj, el) => {
      if (el.name !== 'submit' && el.name !== 'file') {
        if (!el.value) this.err = true;
        obj[el.name] = el.value;
      }
      return obj;
    }, {});
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