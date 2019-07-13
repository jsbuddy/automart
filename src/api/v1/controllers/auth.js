import AuthModel from '../../../models/auth';
import { success } from '../../../helpers/response';
import { transformData } from '../../../helpers';

function handle(err, data, res, status) {
  if (err) {
    return res.status(err.status).json({
      status: err.status, success: false, message: err.message, error: err.message,
    });
  }
  return res.status(status).json({ status, success: true, data: transformData(data) });
}

const User = {
  signup: (req, res) => AuthModel.signup(req.body, (err, data) => handle(err, data, res, 201)),
  signin: (req, res) => AuthModel.signin(req.body, (err, data) => handle(err, data, res, 200)),
  getUser: (req, res) => success(res, undefined, req.user),
  deleteUser: async (req, res) => {
    const { id } = req.params;
    await AuthModel.deleteUser(id);
    return success(res, 'User Deleted Successfully');
  },
};

export default User;
