class Form {
  constructor(form, message) {
    this.form = form;
    this.message = message;
    this.err = false;
  }

  // handle(e) { //.. }

  submit(e) {
    e.preventDefault();
    this.hideMessage();
    this.handle((message, noreset) => {
      message && this.showMessage(message, 'success');
      this.enableForm();
      !noreset && this.form.reset();
    });
  }

  getFieldValue(name) {
    return [...this.form].find(el => el.name === name).value
  }

  getField(name) {
    return [...this.form].find(el => el.name === name);
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
    if (!this.message) return;
    this.message.textContent = message;
    this.message.className = `message mt-2 ${_class}`;
    this.message.style.display = 'block';
  }

  hideMessage() {
    if (!this.message) return;
    this.message.textContent = '';
    this.message.style.display = 'none';
  }

  preFill(data) {
    [...this.form].forEach(el => {
      el.value = data[el.name];
    });
  }
}