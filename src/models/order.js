import Base from './base';
import db from '../db';
import debug from '../lib/debug';

class Order extends Base {
  static async findOne(id) {
    try {
      return (await db.query(`
        SELECT orders.*, row_to_json(row(users."id", users."firstName", users."lastName", users."email", users."address")::TUser) as "buyer", row_to_json(cars) as car 
        FROM ${this.model()}
        JOIN users ON orders.buyer = users.id 
        JOIN cars ON orders."carId" = cars.id 
        WHERE orders.id = $1;
      `, [id])).rows[0];
    } catch (e) {
      debug.error('Postgres Error', e);
    }
  }

  static async findAll() {
    try {
      return (await db.query(`
        SELECT orders.*, row_to_json(row(users."id", users."firstName", users."lastName", users."email", users."address")::TUser) as "buyer", row_to_json(cars) as car 
        FROM ${this.model()} 
        JOIN users ON orders.buyer = users.id 
        JOIN cars ON orders."carId" = cars.id
      `)).rows;
    } catch (e) {
      debug.error('Postgres Error', e);
    }
  }

  static model() {
    return 'orders';
  }

  static async findAllByUser(buyer) {
    try {
      return (await db.query(`
        SELECT orders.*, row_to_json(row(users."id", users."firstName", users."lastName", users."email", users."address")::TUser) as "buyer", row_to_json(cars) as car 
        FROM ${this.model()} 
        JOIN users ON orders.buyer = users.id 
        JOIN cars ON orders."carId" = cars.id 
        WHERE orders.buyer = $1;
      `, [buyer])).rows;
    } catch (e) {
      debug.error('Postgres Error', e);
    }
  }

  static async findAllByCar(id) {
    try {
      return (await db.query(`
        SELECT orders.*, row_to_json(row(users."id", users."firstName", users."lastName", users."email", users."address")::TUser) as "buyer", row_to_json(cars) as car 
        FROM ${this.model()} 
        JOIN users ON orders.buyer = users.id 
        JOIN cars ON orders."carId" = cars.id 
        WHERE orders."carId" = $1;
      `, [id])).rows;
    } catch (e) {
      debug.error('Postgres Error', e);
    }
  }
}

export default Order;
