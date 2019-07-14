import CarModel from '../../../models/car';
import { dataUri } from '../../../middlewares/multer';
import { uploader } from '../../../config/cloudinary';
import { created, notfound, success, unauthorized } from '../../../helpers/response';
import { getAllBy, handleGetOne } from '../../../helpers/callback';

function applyFilters(cars, queries) {
  const { status, state, manufacturer, minPrice, maxPrice, bodyType } = queries;
  let filtered = cars;
  if (status) filtered = filtered.filter(car => car.status === status);
  if (state) filtered = filtered.filter(car => car.state === state);
  if (bodyType) filtered = filtered.filter(car => car.bodyType === bodyType);
  if (minPrice) filtered = filtered.filter(car => car.price >= minPrice);
  if (maxPrice) filtered = filtered.filter(car => car.price <= maxPrice);
  if (manufacturer) {
    const manufacturerRegex = new RegExp(manufacturer, 'gi');
    filtered = filtered.filter(car => car.manufacturer.search(manufacturerRegex) !== -1);
  }
  return filtered;
}

const Car = {
  create: async (req, res, next) => {
    try {
      const { manufacturer, model, bodyType, price, state } = req.body;
      const uploads = (req.files || []).map(file => uploader.upload(dataUri(file).content));
      const images = await Promise.all(uploads);
      const car = await CarModel.create({
        manufacturer, model, bodyType, price, state, owner: req.user.id, images,
      });
      return created(res, 'Ad created successfully', car);
    } catch (error) {
      // TODO: Handle Error
      return next(error);
    }
  },

  getOne: async (req, res) => handleGetOne(req, res, CarModel),

  getAll: async (req, res) => {
    let cars = await CarModel.findAll();
    cars = applyFilters(cars, req.query);
    success(res, undefined, cars);
  },

  getAllByOwner: async (req, res) => getAllBy(req, res, CarModel),

  update: async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    let car = await CarModel.findOne(id);
    if (!car) return notfound(res, 'Car not found');
    if (car.owner.id !== req.user.id) return unauthorized(res);
    await CarModel.update(id, data);
    car = await CarModel.findOne(id);
    return success(res, undefined, car);
  },

  delete: async (req, res) => {
    const { id } = req.params;
    const car = await CarModel.findOne(id);
    if (!car) return notfound(res, 'Car not found');
    await CarModel.delete(id);
    car.images.forEach(image => uploader.destroy(image.public_id));
    return success(res, 'Car deleted successfully');
  },
};

export default Car;
