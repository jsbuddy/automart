import Base from './base';
import db from '../db';

class Order extends Base {
  static async findOne(id) {
    const { rows } = await db.query(`
      SELECT orders.*, row_to_json(row(users."id", users."firstName", users."lastName", users."email", users."address")::TUser) as "buyer" 
      FROM ${this.model()} INNER JOIN users ON orders.id = $1;
    `, [id]);
    return rows[0];
  }

  static async findAll() {
    const { rows } = await db.query(`
    SELECT orders.*, row_to_json(row(users."id", users."firstName", users."lastName", users."email", users."address")::TUser) as "buyer" 
    FROM ${this.model()} INNER JOIN users ON orders.buyer = users.id;
    `);
    return rows;
  }

  static model() {
    return 'orders';
  }

  static async findAllByUser(buyer) {
    const { rows } = await db.query(`
      SELECT orders.*, row_to_json(row(users."id", users."firstName", users."lastName", users."email", users."address")::TUser) as "buyer" 
      FROM ${this.model()} INNER JOIN users ON orders.buyer = $1;
    `, [buyer]);
    return rows;
  }
}

export default Order;
