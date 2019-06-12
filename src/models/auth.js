import uuid from 'uuid';
import { secret } from '../config/auth';
import { comparePassword, generateToken, hashPassword } from '../helpers/auth';

class Auth {
  constructor() {
    this.users = [];
  }

  async signup(user, callback) {
    try {
      const newUser = { ...user, id: uuid.v4(), createdAt: Date.now() };
      const { id, firstName, lastName, email } = newUser;
      if (this.emailExists(email)) return callback({ status: 400, message: 'Email address already in use' });
      const token = await generateToken({ id, firstName, lastName }, secret);
      newUser.password = await hashPassword(newUser.password);
      this.users.push(newUser);
      return callback(null, { user: { id, firstName, lastName, email }, message: 'User created successfully', token });
    } catch (error) {
      // TODO Handle Error
      return callback({ status: 500, message: 'An error occurred', error }, null);
    }
  }

  async signin(user, callback) {
    const { email, password } = user;
    try {
      const foundUser = this.findByEmail(email);
      if (foundUser) {
        const passwordsMatch = await comparePassword(password, foundUser.password);
        if (passwordsMatch) {
          const { id, firstName, lastName } = foundUser;
          const token = await generateToken({ id, firstName, lastName }, secret);
          return callback(null, { user: { id, firstName, lastName, email }, token });
        }
        return callback({ status: 400, message: 'Incorrect password' }, null);
      }
      return callback({ status: 404, message: 'User not found' }, null);
    } catch (error) {
      // TODO: Handle Error
      return callback({ status: 500, message: 'An error occurred', error }, null);
    }
  }

  emailExists(email) {
    return this.users.some(user => user.email === email);
  }

  findByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  findById(id) {
    return this.users.find(user => user.id === id);
  }
}

export default new Auth();
