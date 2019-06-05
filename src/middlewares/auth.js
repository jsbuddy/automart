import jwt from 'jsonwebtoken';
import { secret } from '../config/auth';

// eslint-disable-next-line import/prefer-default-export
export function authorize(req, res, next) {
  if (!req.headers.authorization) return res.status(403).json({ success: false, message: 'Forbidden' });
  const token = req.headers.authorization.split(' ')[1];
  if (!token) return res.status(403).json({ success: false, message: 'Forbidden' });
  jwt.verify(token, secret, (err, user) => {
    if (err || !user) res.status(403).json({ success: false, message: 'Forbidden' });
    req.user = user;
    next();
  });
  return null;
}
