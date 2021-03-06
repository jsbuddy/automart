const form = document.getElementById('signupForm');
const message = document.getElementById('signupMessage');

const signup = new Form(form, message);

signup.handle = async function handleSubmit() {
  const data = this.getValuesAsObject();
  if (this.err) return this.showMessage('All fields are required!', 'error');
  this.disableForm();
  const res = await Auth.signup(data);
  if (res.success) {
    Auth.saveToken(res.data.token);
    Auth.redirect('/')
  } else {
    this.showMessage(res.error, 'error');
    this.enableForm();
  }
};

form.addEventListener('submit', (e) => signup.submit(e));
