import CarModel from '../../../models/car';
import { dataUri } from '../../../middlewares/multer';
import { uploader } from '../../../config/cloudinary';

const Car = {
  create: async (req, res, next) => {
    try {
      const uploads = (req.files || []).map(file => uploader.upload(dataUri(file).content));
      const images = await Promise.all(uploads);
      const car = CarModel.create({ ...req.body, owner: req.user.id, images });
      return res.status(201).json({ success: true, car });
    } catch (error) {
      // TODO: Handle Error
      return next(error);
    }
  },

  getOne: (req, res) => {
    const { id } = req.params;
    const car = CarModel.findOne(id);
    res.status(200).json({ success: true, car });
  },

  getAll: (req, res) => {
    // eslint-disable-next-line object-curly-newline
    const { status, state, manufacturer = '', bodyType = '', minPrice, maxPrice } = req.query;
    let cars = CarModel.findAll();
    if (status) cars = cars.filter(car => car.status === status);
    if (state) cars = cars.filter(car => car.state === state);
    if (bodyType) cars = cars.filter(car => car.bodyType === bodyType);
    if (minPrice) cars = cars.filter(car => car.price >= minPrice);
    if (maxPrice) cars = cars.filter(car => car.price <= maxPrice);
    if (manufacturer.trim()) {
      const manufacturerRegex = new RegExp(manufacturer, 'gi');
      cars = cars.filter(car => car.manufacturer.search(manufacturerRegex) !== -1);
    }
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
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
    if (car.owner !== req.user.id) return res.status(401).json({ success: false });
    car = CarModel.delete(id);
    car.images.forEach(image => uploader.destroy(image.public_id));
    return res.status(200).json({ success: true, message: 'Car deleted successfully' });
  },
};

export default Car;
