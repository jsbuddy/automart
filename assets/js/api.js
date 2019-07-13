const parseQueries = (queries) => {
  const keys = Object.keys(queries);
  return keys.reduce((q, key, i) => {
    q += `${i === 0 ? '?' : ''}${key}=${queries[key]}${i !== keys.length - 1 ? '&' : ''}`;
    return q;
  }, '');
};

const sortCars = cars => {
  return cars.sort((a, b) => (new Date(a.createdOn) < new Date(b.createdOn)) ? 1 : -1);
};

async function send(path, options, json) {
  const headers = json ? { Accept: 'application/json', 'Content-Type': 'application/json', } : {};
  const { success, message, data } = await (await fetch(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${Auth.getToken()}`,
      ...headers
    }
  })).json();
  return { success, message, data: data ? transformData(data) : data };
}

const Api = {
  async getCar(id) {
    const res = await send(`${Auth.api}/car/${id}`, { method: 'GET' });
    return res.data;
  },
  async getCars(queries) {
    let q;
    if (queries) q = parseQueries(queries);
    const res = await send(`${Auth.api}/car${q ? q : ''}`, { method: 'GET' });
    return sortCars(res.data);
  },
  async getAllCars() {
    const res = await send(`${Auth.api}/car`, { method: 'GET' });
    return res.data;
  },
  async getUserCars() {
    const res = await send(`${Auth.api}/car/owner`, { method: 'GET' });
    return sortCars(res.data);
  },
  async getUserOrders() {
    const res = await send(`${Auth.api}/order/buyer`, { method: 'GET' });
    return res.data;
  },
  async getCarOrders(id) {
    const res = await send(`${Auth.api}/order/car/${id}`, { method: 'GET' });
    return res.data;
  },
  async placeOrder(carId, price) {
    return await send(`${Auth.api}/order`, {
      method: 'POST',
      body: JSON.stringify({ carId, price })
    }, true);
  },
  async report(carId, report) {
    return await send(`${Auth.api}/flag`, {
      method: 'POST',
      body: JSON.stringify({ carId, ...report }),
    }, true);
  },
  async createAd(data) {
    return await send(`${Auth.api}/car`, { method: 'POST', body: data });
  },
  async updateCarPrice(id, price) {
    const res = await send(`${Auth.api}/car/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ price })
    }, true);
    return res.data;
  },
  async updateOrderPrice(id, price) {
    const res = await send(`${Auth.api}/order/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ price })
    }, true);
    return res.data;
  },
  async updateOffer(id, update) {
    const res = await send(`${Auth.api}/order/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(update),
    }, true);
    return res.data;
  },
  async getFlags() {
    const res = await send(`${Auth.api}/flag`, { method: 'GET', });
    return res.data;
  },
  async markAsSold(id) {
    const res = await send(`${Auth.api}/car/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'sold' })
    }, true);
    return res.data;
  },
  async deleteCar(id) {
    const res = await send(`${Auth.api}/car/${id}`, {
      method: 'DELETE',
    }, true);
    return res.success;
  }
};
