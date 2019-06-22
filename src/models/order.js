import Base from './base';
import db from '../db';

class Order extends Base {
  static model() {
    return 'orders';
  }

  static async findOne(id) {
    const { rows } = await db.query(`
      SELECT orders.*, row_to_json(row(users."id", users."email", users."firstName", users."lastName")::TUser) as "buyer" 
      FROM orders INNER JOIN users ON orders.id = $1;
    `, [id]);
    return rows[0];
  }

  static async findAll() {
    const { rows } = await db.query(`
      SELECT orders.*, row_to_json(row(users."id", users."email", users."firstName", users."lastName")::TUser) as "buyer" 
      FROM orders INNER JOIN users ON orders.buyer = users.id;
    `);
    return rows;
  }

  static async findAllByBuyer(buyer) {
    const { rows } = await db.query(`
      SELECT orders.*, row_to_json(row(users."id", users."email", users."firstName", users."lastName")::TUser) as "buyer" 
      FROM orders INNER JOIN users ON orders.buyer = $1;
    `, [buyer]);
    return rows;
  }
}

export default Order;
