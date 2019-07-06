import db from '../db';

class Base {
  static async create(data) {
    const keys = Object.keys(data).sort((a, b) => a > b ? 1 : -1);
    const values = keys.map(key => data[key]);
    const fields = keys.map(s => `"${s}"`).join(', ');
    const $s = keys.map((s, i) => `$${i + 1}`).join(', ');
    return (await db.query(`
      INSERT INTO ${this.model()} (${fields})
      VALUES (${$s}) RETURNING "id", ${fields}
    `, [...values])).rows[0];
  }

  static async findAll() {
    return (await db.query(`SELECT * FROM ${this.model()}`)).rows;
  }

  static model() {
    return '';
  }

  static async findOne(id) {
    return (await db.query(`SELECT * FROM ${this.model()} WHERE id = $1`, [id])).rows[0];
  }

  static async update(id, data) {
    const keys = Object.keys(data).sort((a, b) => a > b ? 1 : -1);
    const update = keys.map(key => `"${key}" = ${(typeof data[key] === 'string') ? `'${data[key]}'` : data[key]}`).join(', ');
    return (await db.query(`UPDATE ${this.model()} SET ${update} WHERE id = $1 RETURNING *`, [id])).rows[0];
  }

  static async delete(id) {
    return db.query(`DELETE from ${this.model()} WHERE id = $1`, [id]);
  }
}

export default Base;
