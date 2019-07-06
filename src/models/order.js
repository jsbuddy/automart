import Base from './base';
import db from '../db';

class Order extends Base {
  static async findOne(id) {
    return (await db.query(`
      SELECT orders.*, row_to_json(row(users."id", users."firstName", users."lastName", users."email", users."address")::TUser) as "buyer", row_to_json(cars) as car 
      FROM ${this.model()}
      JOIN users ON orders.buyer = users.id 
      JOIN cars ON orders."carId" = cars.id 
      WHERE orders.id = $1;
    `, [id])).rows[0];
  }

  static async findAll() {
    return (await db.query(`
      SELECT orders.*, row_to_json(row(users."id", users."firstName", users."lastName", users."email", users."address")::TUser) as "buyer", row_to_json(cars) as car 
      FROM ${this.model()} 
      JOIN users ON orders.buyer = users.id 
      JOIN cars ON orders."carId" = cars.id
    `)).rows;
  }

  static model() {
    return 'orders';
  }

  static async findAllByUser(buyer) {
    return (await db.query(`
      SELECT orders.*, row_to_json(row(users."id", users."firstName", users."lastName", users."email", users."address")::TUser) as "buyer", row_to_json(cars) as car 
      FROM ${this.model()} 
      JOIN users ON orders.buyer = users.id 
      JOIN cars ON orders."carId" = cars.id 
      WHERE orders.buyer = $1;
    `, [buyer])).rows;
  }

  static async findAllByCar(id) {
    return (await db.query(`
      SELECT orders.*, row_to_json(row(users."id", users."firstName", users."lastName", users."email", users."address")::TUser) as "buyer", row_to_json(cars) as car 
      FROM ${this.model()} 
      JOIN users ON orders.buyer = users.id 
      JOIN cars ON orders."carId" = cars.id 
      WHERE orders."carId" = $1;
    `, [id])).rows;
  }
}

export default Order;
