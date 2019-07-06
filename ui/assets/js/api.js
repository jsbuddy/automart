const parseQueries = (queries) => {
  const keys = Object.keys(queries);
  return keys.reduce((q, key, i) => {
    q += `${i === 0 ? '?' : ''}${key}=${queries[key]}${i !== keys.length - 1 ? '&' : ''}`;
    return q;
  }, '');
};

const Api = {
  async getCar(id) {
    const res = await (await fetch(`${base}/car/${id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })).json();
    return res.car;
  },
  async getCars(queries) {
    let q;
    if (queries) q = parseQueries(queries);
    const res = await (await fetch(`${base}/car${q ? q : ''}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })).json();
    return res.cars;
  },
  async getAllCars() {
    const res = await (await fetch(`${base}/car`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })).json();
    return res.cars;
  },
  async getUserCars() {
    const res = await (await fetch(`${base}/car/owner`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })).json();
    return res.cars;
  },
  async getUserOrders() {
    const res = await (await fetch(`${base}/order/buyer`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })).json();
    return res.orders;
  },
  async getCarOrders(id) {
    const res = await (await fetch(`${base}/order/car/${id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })).json();
    return res.orders;
  },
  async placeOrder(carId, priceOffered) {
    return await (await fetch(`${base}/order`, {
      method: 'POST',
      body: JSON.stringify({ carId, priceOffered }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`,
      }
    })).json();
  },
  async report(carId, report) {
    return await (await fetch(`${base}/flag`, {
      method: 'POST',
      body: JSON.stringify({ carId, ...report }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`,
      }
    })).json();
  },
  async createAd(data) {
    return await (await fetch(`${base}/car`, {
      method: 'POST',
      body: data,
      headers: {
        Authorization: `Bearer ${Auth.getToken()}`,
      }
    })).json();
  },
  async updateCarPrice(id, price) {
    const res = await (await fetch(`${base}/car/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ price }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`,
      }
    })).json();
    return res.car;
  },
  async updateOrderPrice(id, price) {
    const res = await (await fetch(`${base}/order/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ price }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`,
      }
    })).json();
    return res.order;
  },
  async updateOffer(id, update) {
    const res = await (await fetch(`${base}/order/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(update),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`,
      }
    })).json();
    return res.order;
  },
  async getFlags() {
    const res = await (await fetch(`${base}/flag`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })).json();
    return res.flags;
  },
  async markAsSold(id) {
    const res = await (await fetch(`${base}/car/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'sold' }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`,
      }
    })).json();
    return res.car;
  },
  async deleteCar(id) {
    const res = await (await fetch(`${base}/car/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Auth.getToken()}`,
      }
    })).json();
    console.log({ res });
    return res.success;
  }
};
