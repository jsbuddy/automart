const form = document.getElementById('loginForm');
const message = document.getElementById('loginMessage');

const login = new Form(form, message);

login.handle = async function (e) {
  e.preventDefault();
  this.hideMessage();
  let err = false;
  const data = [...e.target].reduce((obj, el) => {
    if (el.name !== 'submit') {
      if (!el.value.trim()) err = true;
      obj[el.name] = el.value;
    }
    return obj;
  }, {});
  if (err) return this.showMessage('All fields are required!', 'error');
  this.disableForm();
  const res = await Auth.login(data);
  if (res.success) {
    Auth.saveToken(res.token);
    location.pathname = '/';
  } else {
    this.showMessage(res.message, 'error');
    this.enableForm();
  }
};

form.addEventListener('submit', (e) => login.handle(e));