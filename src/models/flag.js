import Base from './base';
import db from '../db';

class Flag extends Base {
  static model() {
    return 'flags';
  }

  static async findAll() {
    try {
      return (await db.query(`
        SELECT flags.*, row_to_json(row(users."id", users."firstName", users."lastName", users."email", users."address")::TUser) as "creator", row_to_json(cars) as car 
        FROM ${this.model()} 
        JOIN users ON flags.creator = users.id
        JOIN cars ON flags."carId" = cars.id;
      `)).rows;
    } catch (e) {
      console.log('PSQL ERROR', e);
    }
  }
}

export default Flag;
