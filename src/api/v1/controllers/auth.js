import AuthModel from '../../../models/auth';
import { success, unauthorized } from '../../../helpers/response';

function handle(err, data, res, status) {
  if (err) return res.status(err.status).json({ success: false, message: err.message });
  return res.status(status).json({ success: true, ...data });
}

const User = {
  signup: (req, res) => AuthModel.signup(req.body, (err, data) => handle(err, data, res, 201)),
  signin: (req, res) => AuthModel.signin(req.body, (err, data) => handle(err, data, res, 200)),
  deleteUser: async (req, res) => {
    if (!req.user.isAdmin) return unauthorized(res);
    const { id } = req.params;
    await AuthModel.deleteUser(id);
    return success(res, 'User Deleted Successfully', { success: true });
  },
};

export default User;
