import env from '../config/env';
import { verifyToken } from '../helpers/auth';
import { unauthorized } from '../helpers/response';
import AuthModel from '../models/auth';

export async function authorize(req, res, next) {
  try {
    if (!req.headers.authorization) return unauthorized(res, 'No authorization token provided, login to get an authorization token');
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return unauthorized(res, 'No authorization token provided, login to get an authorization token');
    const payload = await verifyToken(token, env.SECRET);
    const user = await AuthModel.findById(payload.id);
    if (!user) return unauthorized('Invalid Token');
    req.user = user;
    next();
  } catch (error) {
    unauthorized(res, 'Invalid token');
  }
}

export function admin(req, res, next) {
  if (!req.user.isAdmin) return unauthorized(res);
  next();
}
