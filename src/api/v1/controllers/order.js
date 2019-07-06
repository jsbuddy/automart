import OrderModel from '../../../models/order';
import CarModel from '../../../models/car';
import { handleCreate, handleDelete, handleGetOne, getAllBy } from '../../../helpers/callback';
import { notallowed, notfound, success } from '../../../helpers/response';

const Order = {
  create: async (req, res) => {
    const car = await CarModel.findOne(req.body.carId);
    if (!car) return notfound(res, 'Car not found');
    if (car.owner.id === req.user.id) return notallowed(res, 'You can\'t make a purchase on your car');
    await handleCreate(OrderModel, { ...req.body, buyer: req.user.id, price: car.price }, res, 'order');
  },

  getOne: async (req, res) => handleGetOne(req, res, OrderModel, 'order'),

  getAll: async (req, res) => {
    const orders = await OrderModel.findAll();
    success(res, undefined, { orders });
  },

  getAllByBuyer: async (req, res) => getAllBy(req, res, OrderModel, 'orders'),

  getAllByCar: async (req, res) => {
    const { id } = req.params;
    const orders = await OrderModel.findAllByCar(id);
    success(res, undefined, { orders });
  },

  update: async (req, res) => {
    const { id } = req.params;
    let data = req.body;
    let order = await OrderModel.findOne(id);
    const car = await CarModel.findOne(order.carId);
    if (!order) return notfound(res, 'Order not found');
    if (order.status !== 'pending' && car.owner.id !== req.user.id) return notallowed(res);
    if (data.price) {
      const oldPriceOffered = order.priceOffered;
      const { price, ...newData } = data;
      data = { ...newData, oldPriceOffered, priceOffered: price };
    }
    await OrderModel.update(id, data);
    order = await OrderModel.findOne(id);
    success(res, null, { order });
  },

  delete: (req, res) => handleDelete(req, res, OrderModel, 'Order'),
};

export default Order;
