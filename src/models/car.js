import Base from './base';
import db from '../db';

class Car extends Base {
  static async findOne(id) {
    const { rows } = await db.query(`
      SELECT cars.*, row_to_json(row(users."id", users."firstName", users."lastName", users."email", users."address")::TUser) as "owner" 
      FROM ${this.model()} INNER JOIN users ON cars.id = $1;
      `, [id]);
    return rows[0];
  }

  static async findAll() {
    const { rows } = await db.query(`
      SELECT cars.*, row_to_json(row(users."id", users."firstName", users."lastName", users."email", users."address")::TUser) as "owner" 
      FROM ${this.model()} INNER JOIN users ON cars.owner = users.id;
    `);
    return rows;
  }

  static async findAllByUser(owner) {
    const { rows } = await db.query(`
      SELECT cars.*, row_to_json(row(users."id", users."firstName", users."lastName", users."email", users."address")::TUser) as "owner" 
      FROM ${this.model()} INNER JOIN users ON cars.owner = $1;
    `, [owner]);
    return rows;
  }

  static model() {
    return 'cars';
  }
}

export default Car;
