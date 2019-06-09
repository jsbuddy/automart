import { secret } from '../config/auth';
import { verifyToken } from '../helpers/auth';

// eslint-disable-next-line import/prefer-default-export, consistent-return
export async function authorize(req, res, next) {
  try {
    if (!req.headers.authorization) return res.status(403).json({ success: false, message: 'No authorization token provided, login to get an authorization token' });
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(403).json({ success: false, message: 'No authorization token provided, login to get an authorization token' });
    const user = await verifyToken(token, secret);
    if (!user) return res.status(403).json({ success: false, message: 'Invalid token' });
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: 'Invalid token' });
  }
}
