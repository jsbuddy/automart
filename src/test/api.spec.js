import { describe, it } from 'mocha';
import request from 'supertest';
import app from '../index';

const { expect, assert } = require('chai');

describe('/api', () => {
  const headers = { authorization: null };
  let carId = null;

  describe('/auth', () => {
    const user = { email: 'jd@gmail.com', firstName: 'John', lastName: 'Doe', password: 'p@ssw0rd', address: 'NY' };

    it('POST: should create a new user', (done) => {
      request(app).post('/api/v1/auth/signup').send(user)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('user').that.is.an('object').that.includes.all.keys('id', 'email', 'token');
          done();
        });
    });

    it('POST: should sign user in', (done) => {
      request(app).post('/api/v1/auth/signin').send({ email: user.email, password: user.password })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('user').that.is.an('object').that.includes.all.keys('id', 'token');
          headers.authorization = res.body.user.token;
          done();
        });
    });
  });

  describe('/car', () => {
    it('GET: should return all posted ads whether sold or available', (done) => {
      request(app).get('/api/v1/car').set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('cars').that.is.an('array');
          done();
        });
    });

    it('POST: should create a new car ad', (done) => {
      request(app).post('/api/v1/car')
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

    it('GET: should return a single car', (done) => {
      request(app).get(`/api/v1/car/${carId}`).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('car').that.is.an('object').that.includes.all.keys('id', 'manufacturer', 'model');
          done();
        });
    });

    it('GET: should return all unsold cars', (done) => {
      request(app).get('/api/v1/car?status=available').set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('cars').that.is.an('array');
          assert(res.body.cars.every(car => car.status === 'available'), 'All cars must have a status of available');
          done();
        });
    });

    it('GET: should return all new and unsold cars', (done) => {
      request(app).get('/api/v1/car?status=available&state=new').set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('cars').that.is.an('array');
          assert(res.body.cars.every(car => car.status === 'available' && car.state === 'new'), 'All cars must have status of available and state of new');
          done();
        });
    });

    it('GET: should return all used and unsold cars', (done) => {
      request(app).get('/api/v1/car?status=available&state=used').set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('cars').that.is.an('array');
          assert(res.body.cars.every(car => car.status === 'available' && car.state === 'used'), 'All cars must have status of available and state of used');
          done();
        });
    });

    it('GET: should return all unsold cars of a specific make (manufacturer)', (done) => {
      request(app).get('/api/v1/car?status=available&manufacturer=toyota').set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('cars').that.is.an('array');
          assert(res.body.cars.every(car => car.status === 'available' && car.manufacturer.match(/toyota/gi)), 'All cars must have status of available and match specified manufacturer');
          done();
        });
    });

    it('GET: should return all cars of a specific body type', (done) => {
      request(app).get('/api/v1/car?bodyType=car').set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('cars').that.is.an('array');
          assert.isTrue(res.body.cars.every(car => car.bodyType === 'car'), 'All cars must have bodyType of car');
          done();
        });
    });

    it('GET: should return all unsold cars of a specific price range', (done) => {
      const [minPrice, maxPrice] = [2000, 10000];

      request(app).get(`/api/v1/car?status=available&minPrice=${minPrice}&maxPrice=${maxPrice}`).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('cars').that.is.an('array');
          assert.isTrue(res.body.cars.every(car => (car.status === 'available' && car.price >= minPrice && car.price <= maxPrice)),
            'All cars must be available and within the specified price range');
          done();
        });
    });

    it('PATCH: should mark a posted car ad as sold', (done) => {
      request(app).patch(`/api/v1/car/${carId}`).send({ status: 'sold' }).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('car');
          expect(res.body.car).to.haveOwnProperty('status').that.equals('sold');
          done();
        });
    });

    it('PATCH: should update the price of a car', (done) => {
      const price = 120.45;

      request(app).patch(`/api/v1/car/${carId}`).send({ price }).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('car');
          expect(res.body.car).to.haveOwnProperty('price').that.equals(price);
          done();
        });
    });

    it('DELETE: should delete a specific car ad', (done) => {
      request(app).delete(`/api/v1/car/${carId}`).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('car');
          done();
        });
    });
  });

  describe('/order', () => {
    let orderId;

    it('POST: should create new order', (done) => {
      request(app).post('/api/v1/order').send({ carId, price: 1100, priceOffered: 950 }).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('order').that.is.an('object').that.includes.all.keys('id', 'buyer', 'carId', 'price', 'priceOffered');
          orderId = res.body.order.id;
          done();
        });
    });

    it('PATCH: should update the price of a purchase order (only when order.status === \'pending\')', (done) => {
      const amount = 1000;

      request(app).patch(`/api/v1/order/${orderId}`).send({ amount }).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('order');
          expect(res.body.order).to.have.property('status').that.equals('pending');
          expect(res.body.order).to.haveOwnProperty('amount').that.equals(amount);
          done();
        });
    });
  });

  describe('/flag', () => {
    it('POST: should report a posted AD as fraudulent', (done) => {
      const flag = { carId, reason: 'pricing', description: 'description' };

      request(app).post('/api/v1/flag').send(flag).set(headers)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('flag').that.is.an('object').that.includes.all.keys('id', 'reason', 'description');
          done();
        });
    });
  });
});
