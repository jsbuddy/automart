// import uuid from 'uuid';
import db from '../db';

class Base {
  static async create(data) {
    try {
      const keys = Object.keys(data).sort((a, b) => a > b ? 1 : -1);
      const values = keys.map(key => data[key]);
      const fields = keys.map(s => `"${s}"`).join(', ');
      const $s = keys.map((s, i) => `$${i + 1}`).join(', ');
      const { rows } = await db.query(`
      INSERT INTO ${this.model()} (${fields})
      VALUES (${$s}) RETURNING "id", ${fields}
    `, [...values]);
      return rows[0];
    } catch (err) {
      console.dir(err);
    }
  }

  static async findAll() {
    const { rows } = await db.query(`SELECT * FROM ${this.model()}`);
    return rows;
  }

  static model() {
    return '';
  }

  static async findOne(id) {
    const { rows } = await db.query(`SELECT * FROM ${this.model()} WHERE id = $1`, [id]);
    return rows[0];
  }

  static async update(id, data) {
    const keys = Object.keys(data).sort((a, b) => a > b ? 1 : -1);
    const update = keys.map(key => `"${key}" = ${(typeof data[key] === 'string') ? `'${data[key]}'` : data[key]}`).join(', ');
    console.log(`UPDATE ${this.model()} SET ${update} WHERE id = $1 RETURNING *`);
    const { rows } = await db.query(`UPDATE ${this.model()} SET ${update} WHERE id = $1 RETURNING *`, [id]);
    return rows[0];
  }

  static async delete(id) {
    await db.query(`DELETE from ${this.model()} WHERE id = $1`, [id]);
  }
}

export default Base;
