import CarModel from '../../../models/car';
import { dataUri } from '../../../middlewares/multer';
import { uploader } from '../../../config/cloudinary';
import { unauthorized, notfound, success, created } from '../../../helpers/response';

const Car = {
  create: async (req, res, next) => {
    try {
      const uploads = (req.files || []).map(file => uploader.upload(dataUri(file).content));
      const images = await Promise.all(uploads);
      const car = CarModel.create({ ...req.body, owner: req.user.id, images });
      return created(res, 'Ad created successfully', { car });
    } catch (error) {
      // TODO: Handle Error
      return next(error);
    }
  },

  getOne: (req, res) => {
    const { id } = req.params;
    const car = CarModel.findOne(id);
    if (!car) return notfound(res, 'Car not found');
    return success(res, null, { car });
  },

  getAll: (req, res) => {
    let cars = CarModel.findAll();
    const { status, state, manufacturer, bodyType, minPrice, maxPrice } = req.query;
    if (status) cars = cars.filter(car => car.status === status);
    if (state) cars = cars.filter(car => car.state === state);
    if (bodyType) cars = cars.filter(car => car.bodyType === bodyType);
    if (minPrice) cars = cars.filter(car => car.price >= minPrice);
    if (maxPrice) cars = cars.filter(car => car.price <= maxPrice);
    if (manufacturer) {
      const manufacturerRegex = new RegExp(manufacturer, 'gi');
      cars = cars.filter(car => car.manufacturer.search(manufacturerRegex) !== -1);
    }
    success(res, null, { cars });
  },

  update: (req, res) => {
    const { id } = req.params;
    const data = req.body;
    let car = CarModel.findOne(id);
    if (!car) return notfound(res, 'Car not found');
    if (car.owner !== req.user.id) return unauthorized(res);
    car = CarModel.update(id, data);
    return success(res, null, { car });
  },

  delete: (req, res) => {
    const { id } = req.params;
    const car = CarModel.findOne(id);
    if (!car) return notfound(res, 'Car not found');
    if (car.owner !== req.user.id) return unauthorized(res);
    CarModel.delete(id);
    car.images.forEach(image => uploader.destroy(image.public_id));
    return success(res, 'Car deleted successfully', { success: true });
  },
};

export default Car;
