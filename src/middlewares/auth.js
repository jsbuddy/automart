import { secret } from '../config/auth';
import { verifyToken } from '../helpers/auth';

// eslint-disable-next-line import/prefer-default-export
export async function authorize(req, res, next) {
  if (!req.headers.authorization) return res.status(403).json({ success: false, message: 'No authorization token provided' });
  const token = req.headers.authorization.split(' ')[1];
  if (!token) return res.status(403).json({ success: false, message: 'No authorization token provided' });
  const user = await verifyToken(token, secret);
  if (!user) return res.status(403).json({ success: false, message: 'Invalid token' });
  req.user = user;
  return next();
}
