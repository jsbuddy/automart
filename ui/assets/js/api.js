const parseQueries = (queries) => {
  const keys = Object.keys(queries);
  return keys.reduce((q, key, i) => {
    q += `${i === 0 ? '?' : ''}${key}=${queries[key]}${i !== keys.length - 1 ? '&' : ''}`;
    return q;
  }, '');
};

const sortCars = cars => {
  return cars.sort((a, b) => (new Date(a.createdAt) < new Date(b.createdAt)) ? 1 : -1);
};

async function send(path, options, json) {
  const headers = json ? { Accept: 'application/json', 'Content-Type': 'application/json', } : {};
  return await (await fetch(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${Auth.getToken()}`,
      ...headers
    }
  })).json();
}

const Api = {
  async getCar(id) {
    const res = await send(`${api}/car/${id}`, { method: 'GET' });
    return res.car;
  },
  async getCars(queries) {
    let q;
    if (queries) q = parseQueries(queries);
    const res = await send(`${api}/car${q ? q : ''}`, { method: 'GET' });
    return sortCars(res.cars);
  },
  async getAllCars() {
    const res = await send(`${api}/car`, { method: 'GET' });
    return res.cars;
  },
  async getUserCars() {
    const res = await send(`${api}/car/owner`, { method: 'GET' });
    return sortCars(res.cars);
  },
  async getUserOrders() {
    const res = await send(`${api}/order/buyer`, { method: 'GET' });
    return res.orders;
  },
  async getCarOrders(id) {
    const res = await send(`${api}/order/car/${id}`, { method: 'GET' });
    return res.orders;
  },
  async placeOrder(carId, priceOffered) {
    return await send(`${api}/order`, {
      method: 'POST',
      body: JSON.stringify({ carId, priceOffered })
    }, true);
  },
  async report(carId, report) {
    return await send(`${api}/flag`, {
      method: 'POST',
      body: JSON.stringify({ carId, ...report }),
    }, true);
  },
  async createAd(data) {
    return await send(`${api}/car`, { method: 'POST', body: data, });
  },
  async updateCarPrice(id, price) {
    const res = await send(`${api}/car/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ price })
    }, true);
    return res.car;
  },
  async updateOrderPrice(id, price) {
    const res = await send(`${api}/order/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ price })
    }, true);
    return res.order;
  },
  async updateOffer(id, update) {
    const res = await send(`${api}/order/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(update),
    }, true);
    return res.order;
  },
  async getFlags() {
    const res = await send(`${api}/flag`, { method: 'GET', });
    return res.flags;
  },
  async markAsSold(id) {
    const res = await send(`${api}/car/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'sold' })
    }, true);
    return res.car;
  },
  async deleteCar(id) {
    const res = await send(`${api}/car/${id}`, {
      method: 'DELETE',
    }, true);
    return res.success;
  }
};
