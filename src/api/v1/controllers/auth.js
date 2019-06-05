import AuthModel from '../../../models/auth';

const User = {
  signup: (req, res) => {
    AuthModel.signup(req.body, (err, user) => {
      if (err) return res.status(err.status).json({ success: false, message: err.message });
      return res.status(201).json({ success: true, user });
    });
  },
  signin: (req, res) => {
    AuthModel.signin(req.body, (err, user) => {
      if (err) return res.status(err.status).json({ success: false, message: err.message });
      return res.status(200).json({ success: true, user });
    });
  },
};

export default User;
