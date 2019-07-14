import OrderModel from '../../../models/order';
import CarModel from '../../../models/car';
import { getAllBy, handleCreate, handleDelete, handleGetOne } from '../../../helpers/callback';
import { notallowed, notfound, success } from '../../../helpers/response';

const Order = {
  create: async (req, res) => {
    const { carId, price, status = 'pending', amount } = req.body;
    const car = await CarModel.findOne(carId);
    if (!car) return notfound(res, 'Car not found');
    await handleCreate(OrderModel, {
      carId, priceOffered: price || amount, status, buyer: req.user.id, price: car.price,
    }, res);
  },

  getOne: async (req, res) => handleGetOne(req, res, OrderModel),

  getAll: async (req, res) => {
    const orders = await OrderModel.findAll();
    success(res, undefined, orders);
  },

  getAllByBuyer: async (req, res) => getAllBy(req, res, OrderModel),

  getAllByCar: async (req, res) => {
    const { id } = req.params;
    const orders = await OrderModel.findAllByCar(id);
    success(res, undefined, orders);
  },

  update: async (req, res) => {
    const { id } = req.params;
    const { status, price } = req.body;
    let order = await OrderModel.findOne(id);
    if (!order) return notfound(res, 'Order not found');
    const car = await CarModel.findOne(order.carId);
    if (!(order.status === 'pending' && car.owner.id === req.user.id)) return notallowed(res);
    let update = { status };
    if (price) {
      const oldPriceOffered = order.priceOffered;
      update = { oldPriceOffered, priceOffered: price, newPriceOffered: price };
    }
    await OrderModel.update(id, update);
    order = await OrderModel.findOne(id);
    success(res, undefined, order);
  },

  delete: (req, res) => handleDelete(req, res, OrderModel),
};

export default Order;
