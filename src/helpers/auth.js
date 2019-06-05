import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export function generateToken(payload, secret) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, (err, token) => {
      if (err) reject(err);
      resolve(`BEARER ${token}`);
    });
  });
}

export function hashPassword(password) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (_, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  });
}

export function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}
