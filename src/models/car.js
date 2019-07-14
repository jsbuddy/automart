import Base from './base';
import db from '../db';

class Car extends Base {
  static async findOne(id) {
    try {
      return (await db.query(`
        SELECT cars.*, row_to_json(row(users."id", users."firstName", users."lastName", users."email", users."address")::TUser) as "owner" 
        FROM ${this.model()} JOIN users ON cars.owner = users.id
        WHERE cars.id = $1;
        `, [id])).rows[0];
    } catch (e) {
      console.log('PSQL ERROR', e);
    }
  }

  static async findAll() {
    try {
      return (await db.query(`
        SELECT cars.*, row_to_json(row(users."id", users."firstName", users."lastName", users."email", users."address")::TUser) as "owner" 
        FROM ${this.model()} JOIN users ON cars.owner = users.id;
      `)).rows;
    } catch (e) {
      console.log('PSQL ERROR', e);
    }
  }

  static async findAllByUser(owner) {
    try {
      return (await db.query(`
        SELECT cars.*, row_to_json(row(users."id", users."firstName", users."lastName", users."email", users."address")::TUser) as "owner" 
        FROM ${this.model()} JOIN users ON users.id = cars.owner 
        WHERE users.id = $1;
      `, [owner])).rows;
    } catch (e) {
      console.log('PSQL ERROR', e);
    }
  }

  static model() {
    return 'cars';
  }
}

export default Car;
