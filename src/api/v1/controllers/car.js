import CarModel from '../../../models/car';
import { dataUri } from '../../../middlewares/multer';
import { uploader } from '../../../config/cloudinary';
import { unauthorized } from '../../../helpers/response';

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
    if (!car) return res.satus(404).json({ success: false, message: 'No car with that ID' });
    return res.status(200).json({ success: true, car });
  },

  getAll: (req, res) => {
    let cars = CarModel.findAll();
    if (req.query.status) cars = cars.filter(car => car.status === req.query.status);
    if (req.query.state) cars = cars.filter(car => car.state === req.query.state);
    if (req.query.bodyType) cars = cars.filter(car => car.bodyType === req.query.bodyType);
    if (req.query.minPrice) cars = cars.filter(car => car.price >= req.query.minPrice);
    if (req.query.maxPrice) cars = cars.filter(car => car.price <= req.query.maxPrice);
    if (req.query.manufacturer) {
      const manufacturerRegex = new RegExp(req.query.manufacturer, 'gi');
      cars = cars.filter(car => car.manufacturer.search(manufacturerRegex) !== -1);
    }
    res.status(200).json({ success: true, cars });
  },

  update: (req, res) => {
    const { id } = req.params;
    const data = req.body;
    let car = CarModel.findOne(id);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
    if (car.owner !== req.user.id) return unauthorized(res);
    car = CarModel.update(id, data);
    return res.status(200).json({ success: true, car });
  },

  delete: (req, res) => {
    const { id } = req.params;
    const car = CarModel.findOne(id);
    if (!car) return res.status(404).json({ success: false, message: 'Car not found' });
    if (car.owner !== req.user.id) return unauthorized(res);
    CarModel.delete(id);
    car.images.forEach(image => uploader.destroy(image.public_id));
    return res.status(200).json({ success: true, message: 'Car deleted successfully' });
  },
};

export default Car;
