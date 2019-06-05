import CarModel from '../../../models/car';

const Car = {
  create: (req, res) => {
    const car = CarModel.create({ ...req.body, owner: req.user.id });
    res.status(201).json({ success: true, car });
  },

  getOne: (req, res) => {
    const { id } = req.params;
    const car = CarModel.findOne(id);
    res.status(200).json({ success: true, car });
  },

  getAll: (req, res) => {
    // eslint-disable-next-line object-curly-newline
    const { status, state, manufacturer = '', bodyType = '', minPrice, maxPrice } = req.query;
    const manufacturerRegex = new RegExp(manufacturer, 'gi');
    const cars = CarModel.findAll()
      .filter(car => (status ? (car.status === status) : true))
      .filter(car => (state ? (car.state === state) : true))
      .filter(car => (bodyType ? (car.bodyType === bodyType) : true))
      .filter(car => (minPrice ? (car.price >= minPrice) : true))
      .filter(car => (maxPrice ? (car.price <= maxPrice) : true))
      .filter(car => (manufacturer.trim()
        ? (car.manufacturer.search(manufacturerRegex) !== -1) : true));
    res.status(200).json({ success: true, cars });
  },

  update: (req, res) => {
    const { id } = req.params;
    const data = req.body;
    let car = CarModel.findOne(id);
    if (car.owner === req.user.id) {
      car = CarModel.update(id, data);
      res.status(200).json({ success: true, car });
    } else {
      res.status(401).json({ success: false });
    }
  },

  delete: (req, res) => {
    const { id } = req.params;
    let car = CarModel.findOne(id);
    if (car.owner === req.user.id) {
      car = CarModel.delete(id);
      res.status(200).json({ success: true, car });
    } else {
      res.status(401).json({ success: false });
    }
  },
};

export default Car;
