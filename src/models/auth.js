import env from '../config/env';
import { comparePassword, generateToken, hashPassword } from '../helpers/auth';
import db from '../db';

class Auth {
  static async signup(user, callback) {
    try {
      const { firstName, lastName, email, address, isAdmin = false } = user;
      const password = await hashPassword(user.password);
      const { rows } = await db.query(`
        INSERT INTO users ("firstName", "lastName", "email", "password", "address", "isAdmin") 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING "id", "firstName", "lastName", "email", "address", "isAdmin"
      `, [firstName, lastName, email, password, address, isAdmin]);
      const newUser = rows[0];
      const token = await generateToken({ ...newUser }, env.SECRET);
      return callback(null, {
        user: newUser,
        message: 'User created successfully',
        token,
      });
    } catch (err) {
      if (err.code && err.code === '23505') return callback({ status: 400, message: 'Email address already in use' });
      return callback({ status: 500, message: 'An error occurred', err }, null);
    }
  }

  static async signin(user, callback) {
    try {
      const { email, password } = user;
      const foundUser = await this.findByEmail(email);
      if (!foundUser) return callback({ status: 404, message: 'User not found' }, null);
      const passwordsMatch = await comparePassword(password, foundUser.password);
      if (!passwordsMatch) return callback({ status: 400, message: 'Incorrect password' }, null);
      const { id, firstName, lastName } = foundUser;
      const token = await generateToken({ id, firstName, lastName }, env.SECRET);
      return callback(null, { user: { id, firstName, lastName, email }, token });
    } catch (err) {
      return callback({ status: 500, message: 'An error occurred', err }, null);
    }
  }

  static async findById(id) {
    const { rows } = await db.query('SELECT "id", "firstName", "lastName", "email", "isAdmin" from users WHERE id = $1', [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const { rows } = await db.query('SELECT "id", "firstName", "lastName", "email", "password", "isAdmin" from users WHERE email = $1', [email]);
    return rows[0];
  }

  static async deleteUser(id) {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
  }
}

export default Auth;
