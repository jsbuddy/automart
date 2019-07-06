const form = document.getElementById('signupForm');
const message = document.getElementById('signupMessage');

const signup = new Form(form, message);

signup.handle = async function handleSubmit(e) {
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
  const res = await Auth.signup(data);
  if (res.success) {
    Auth.saveToken(res.token);
    location.pathname = '/';
  } else {
    this.showMessage(res.message, 'error');
    this.enableForm();
  }
};

form.addEventListener('submit', (e) => signup.handle(e));
