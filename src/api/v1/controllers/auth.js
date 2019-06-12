import AuthModel from '../../../models/auth';

function handle(err, data, res, status) {
  if (err) return res.status(err.status).json({ success: false, message: err.message });
  return res.status(status).json({ success: true, ...data });
}

const User = {
  signup: (req, res) => AuthModel.signup(req.body, (err, data) => handle(err, data, res, 201)),
  signin: (req, res) => AuthModel.signin(req.body, (err, data) => handle(err, data, res, 200)),
};

export default User;
