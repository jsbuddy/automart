import { describe, it } from 'mocha';
import request from 'supertest';
import app from '../index';

const { expect, assert } = require('chai');

describe('/api', () => {
  const api = '/api/v1';
  const headers = { authorization: null };
  let carId;
  let userId;
  let flagId;
  let orderId;

  describe('/auth', () => {
    const user = {
      email: 'test@test.com',
      firstName: 'Test',
      lastName: 'Test',
      password: 'testing',
      address: 'NG',
      isAdmin: true,
    };

    it('should invalidate fields against schema', (done) => {
      request(app).post(`${api}/auth/signup`).send({ john: 'doe' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });

    it('should create a new user', (done) => {
      request(app).post(`${api}/auth/signup`).send(user)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('user').that.is.an('object').that.includes.all.keys('id', 'email');
          expect(res.body).to.haveOwnProperty('token');
          done();
        });
    });

    it('should not allow creating a new user with an email that\'s already been used', (done) => {
      request(app).post(`${api}/auth/signup`).send(user)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('success').that.equals(false);
          done();
        });
    });

    it('should not find user with specified email address', (done) => {
      request(app).post(`${api}/auth/signin`).send({ email: 'unknowemail@gmail.com', password: 'unknowkpassword' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('success').that.equals(false);
          done();
        });
    });

    it('should not authenticate user due to incorrect password', (done) => {
      request(app).post(`${api}/auth/signin`).send({ email: user.email, password: 'incorrectpassword' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('success').that.equals(false);
          done();
        });
    });

    it('should authenticate user', (done) => {
      request(app).post(`${api}/auth/signin`).send({ email: user.email, password: user.password })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('user').that.is.an('object').that.includes.all.keys('id', 'email');
          expect(res.body).to.haveOwnProperty('token');
          headers.authorization = `Bearer ${res.body.token}`;
          userId = res.body.user.id;
          done();
        });
    });

    it('should return a user', (done) => {
      request(app).get(`${api}/auth/user`).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('user').that.is.an('object').that.includes.all.keys('id', 'email');
          done();
        });
    });

    it('should not authorize user due to absence of authorization header', (done) => {
      request(app).get(`${api}/car`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });

    it('should not authorize user due to invalid token in authorization header', (done) => {
      request(app).get(`${api}/car`).send({ authorization: 'invalidtoken' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });

    it('should not authorize user due to invalid token in authorization header', (done) => {
      request(app).get(`${api}/car`).send({ authorization: 'Bearer invalidtoken' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });
  });

  describe('/car', () => {
    it('should return all posted ads whether sold or available', (done) => {
      request(app).get(`${api}/car`).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('cars').that.is.an('array');
          done();
        });
    });

    it('should create a new car ad', (done) => {
      request(app).post(`${api}/car`)
        .send({
          manufacturer: 'Toyota', model: 'X1', state: 'new', bodyType: 'car', price: 1000,
        }).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('car').that.is.an('object').that.includes.all.keys('id', 'manufacturer', 'model');
          carId = res.body.car.id;
          done();
        });
    });

    it('should return a single car', (done) => {
      request(app).get(`${api}/car/${carId}`).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('car').that.is.an('object').that.includes.all.keys('id', 'manufacturer', 'model');
          done();
        });
    });

    it('should return all cars for a specific owner', (done) => {
      request(app).get(`${api}/car/owner/${userId}`).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('cars').that.is.an('array');
          done();
        });
    });

    it('should not be able to find car with specified id', (done) => {
      request(app).get(`${api}/car/99c92791-ef23-4cc4-8e71-ca81b109d3eb`).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.not.have.property('car');
          done();
        });
    });


    it('should return all unsold cars', (done) => {
      request(app).get(`${api}/car?status=available`).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('cars').that.is.an('array');
          assert(res.body.cars.every(car => car.status === 'available'), 'All cars must have a status of available');
          done();
        });
    });

    it('should return all new and unsold cars', (done) => {
      request(app).get(`${api}/car?status=available&state=new`).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('cars').that.is.an('array');
          assert(res.body.cars.every(car => car.status === 'available' && car.state === 'new'), 'All cars must have status of available and state of new');
          done();
        });
    });

    it('should return all used and unsold cars', (done) => {
      request(app).get(`${api}/car?status=available&state=used`).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('cars').that.is.an('array');
          assert(res.body.cars.every(car => car.status === 'available' && car.state === 'used'), 'All cars must have status of available and state of used');
          done();
        });
    });

    it('should return all unsold cars of a specific make (manufacturer)', (done) => {
      request(app).get(`${api}/car?status=available&manufacturer=toyota`).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('cars').that.is.an('array');
          assert(res.body.cars.every(car => car.status === 'available' && car.manufacturer.match(/toyota/gi)), 'All cars must have status of available and match specified manufacturer');
          done();
        });
    });

    it('should return all cars of a specific body type', (done) => {
      request(app).get(`${api}/car?bodyType=car`).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('cars').that.is.an('array');
          assert.isTrue(res.body.cars.every(car => car.bodyType === 'car'), 'All cars must have bodyType of car');
          done();
        });
    });

    it('should return all unsold cars of a specific price range', (done) => {
      const [minPrice, maxPrice] = [2000, 10000];

      request(app).get(`${api}/car?status=available&minPrice=${minPrice}&maxPrice=${maxPrice}`).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('cars').that.is.an('array');
          assert.isTrue(res.body.cars.every(car => (car.status === 'available' && car.price >= minPrice && car.price <= maxPrice)),
            'All cars must be available and within the specified price range');
          done();
        });
    });

    it('should mark a posted car ad as sold', (done) => {
      request(app).patch(`${api}/car/${carId}`).send({ status: 'sold' }).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('car');
          expect(res.body.car).to.haveOwnProperty('status').that.equals('sold');
          done();
        });
    });

    it('should update the price of a car', (done) => {
      const price = 120.45;

      request(app).patch(`${api}/car/${carId}`).send({ price }).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('car');
          expect(res.body.car).to.haveOwnProperty('price').that.equals(price);
          done();
        });
    });
  });

  describe('/order', () => {
    it('should create new order', (done) => {
      request(app).post(`${api}/order`).send({ carId, priceOffered: 950 }).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('order').that.is.an('object').that.includes.all.keys('id', 'buyer', 'carId', 'price', 'priceOffered');
          orderId = res.body.order.id;
          done();
        });
    });

    it('should not be able to create order due to unknown carId', (done) => {
      request(app).post(`${api}/order/99c92791-ef23-4cc4-8e71-ca81b109d3eb`)
        .send({ carId, priceOffered: 950 }).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('success').that.equals(false);
          done();
        });
    });

    it('should return all order', (done) => {
      request(app).get(`${api}/order`).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('orders').that.is.an('array');
          done();
        });
    });

    it('should return single order', (done) => {
      request(app).get(`${api}/order/${orderId}`).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('order').that.is.an('object').that.includes.all.keys('id', 'buyer', 'carId', 'price', 'priceOffered');
          done();
        });
    });

    it('should return all order for a specific car', (done) => {
      request(app).get(`${api}/order/car/${carId}`).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('orders').that.is.an('array');
          done();
        });
    });

    it('should not be able to find order with specified id', (done) => {
      request(app).get(`${api}/order/99c92791-ef23-4cc4-8e71-ca81b109d3eb`).set(headers)
        .end((err, res) => {
          console.log(res.body);
          expect(res.status).to.equal(404);
          expect(res.body).to.not.have.property('order');
          done();
        });
    });

    it('should not be able to update order with specified id', (done) => {
      request(app).patch(`${api}/order/99c92791-ef23-4cc4-8e71-ca81b109d3eb`).set(headers)
        .end((err, res) => {
          console.log(res.body);
          expect(res.status).to.equal(404);
          expect(res.body).to.have.property('success').that.equals(false);
          done();
        });
    });

    it('should update the price of a purchase order (only when order.status === \'pending\')', (done) => {
      const price = 1000;

      request(app).patch(`${api}/order/${orderId}`).send({ price }).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('order');
          expect(res.body.order).to.have.property('status').that.equals('pending');
          expect(res.body.order).to.haveOwnProperty('oldPriceOffered');
          expect(res.body.order).to.haveOwnProperty('priceOffered').that.equals(price);
          done();
        });
    });

    it('should set the status of an order to accepted', (done) => {
      request(app).patch(`${api}/order/${orderId}`).send({ status: 'accepted' }).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('order');
          expect(res.body.order).to.have.property('status').that.equals('accepted');
          done();
        });
    });

    it('should not allow updating an order while status !== pending', (done) => {
      request(app).patch(`${api}/order/${orderId}`).send({ price: 1000 }).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(405);
          expect(res.body).to.have.property('success').that.equals(false);
          done();
        });
    });
  });

  describe('/flag', () => {
    it('should report a posted AD as fraudulent', (done) => {
      const flag = { carId, reason: 'pricing', description: 'description' };

      request(app).post(`${api}/flag`).send(flag).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('flag').that.is.an('object').that.includes.all.keys('id', 'reason', 'description');
          flagId = res.body.flag.id;
          done();
        });
    });

    it('should return all flags', (done) => {
      request(app).get(`${api}/flag`).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('flags').that.is.an('array');
          done();
        });
    });
  });

  describe('Cleanup', () => {
    it('should delete a specific flag', (done) => {
      request(app).delete(`${api}/flag/${flagId}`).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('success').that.equals(true);
          done();
        });
    });

    it('should delete a specific order', (done) => {
      request(app).delete(`${api}/order/${orderId}`).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('success').that.equals(true);
          done();
        });
    });

    it('should delete a specific car ad', (done) => {
      request(app).delete(`${api}/car/${carId}`).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('success').that.equals(true);
          done();
        });
    });

    it('should delete a user', (done) => {
      request(app).delete(`${api}/auth/user/${userId}`).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('success').that.equals(true);
          done();
        });
    });
  });
});
