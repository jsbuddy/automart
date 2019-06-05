import uuid from 'uuid';

class Base {
  constructor() {
    this.data = [];
  }

  create(data) {
    const current = {
      id: uuid.v4(), ...data, createdOn: Date.now(),
    };
    this.data.push(current);
    return current;
  }

  findOne(id) {
    return this.data.find(current => current.id === id);
  }

  findAll() {
    return this.data;
  }

  update(id, data) {
    this.data = this.data.map((current) => {
      if (current.id === id) {
        return { ...current, ...data };
      }
      return current;
    });
    return this.findOne(id);
  }

  delete(id) {
    const deleted = this.findOne(id);
    this.data = this.data.filter(current => current.id !== id);
    return deleted;
  }
}

export default Base;
