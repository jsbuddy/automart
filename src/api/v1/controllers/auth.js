import AuthModel from '../../../models/auth';

function handle(err, user, res, status) {
  if (err) return res.status(err.status).json({ success: false, message: err.message });
  return res.status(status).json({ success: true, user });
}

const User = {
  signup: (req, res) => AuthModel.signup(req.body, (err, user) => handle(err, user, res, 201)),
  signin: (req, res) => AuthModel.signin(req.body, (err, user) => handle(err, user, res, 200)),
};

export default User;
