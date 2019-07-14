import db from '../db';
import debug from '../lib/debug';

class Base {
  static async create(data) {
    try {
      const keys = Object.keys(data).sort((a, b) => a > b ? 1 : -1);
      const values = keys.map(key => data[key]);
      const fields = keys.map(s => `"${s}"`).join(', ');
      const $s = keys.map((s, i) => `$${i + 1}`).join(', ');
      return (await db.query(`
        INSERT INTO ${this.model()} (${fields})
        VALUES (${$s}) RETURNING *
      `, [...values])).rows[0];
    } catch (e) {
      debug.error('Postgres Error', e);
    }
  }

  static async update(id, data) {
    try {
      const keys = Object.keys(data).sort((a, b) => a > b ? 1 : -1);
      const update = keys.map(key => `"${key}" = ${(typeof data[key] === 'string') ? `'${data[key]}'` : data[key]}`).join(', ');
      return (await db.query(`UPDATE ${this.model()} SET ${update} WHERE id = $1 RETURNING *`, [id])).rows[0];
    } catch (e) {
      debug.error('Postgres Error', e);
    }
  }

  static async delete(id) {
    try {
      return db.query(`DELETE from ${this.model()} WHERE id = $1`, [id]);
    } catch (e) {
      debug.error('Postgres Error', e);
    }
  }
}

export default Base;
