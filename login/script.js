const form = document.getElementById('loginForm');
const message = document.getElementById('loginMessage');

const login = new Form(form, message);

login.handle = async function () {
  const data = this.getValuesAsObject();
  if (this.err) return this.showMessage('All fields are required!', 'error');
  this.disableForm();
  const res = await Auth.login(data);
  if (res.success) {
    Auth.saveToken(res.data.token);
    Auth.redirect('/');
  } else {
    this.showMessage(res.message, 'error');
    this.enableForm();
  }
};

form.addEventListener('submit', (e) => login.submit(e));