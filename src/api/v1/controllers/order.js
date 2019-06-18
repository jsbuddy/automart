import OrderModel from '../../../models/order';
import CarModel from '../../../models/car';
import { handleCreate, handleDelete } from '../../../helpers/callback';
import { notallowed, notfound, success } from '../../../helpers/response';

const Order = {
  create: async (req, res) => {
    const car = await CarModel.findOne(req.body.carId);
    if (!car) return notfound(res, 'Car not found');
    await handleCreate(OrderModel, { ...req.body, buyer: req.user.id }, res, 'order');
  },
  update: async (req, res) => {
    const { id } = req.params;
    let data = req.body;
    let order = await OrderModel.findOne(id);
    if (!order) return notfound(res, 'Order not found');
    if (order.status !== 'pending') return notallowed(res);
    if (data.price) {
      const oldPriceOffered = order.priceOffered;
      const { price, ...newData } = data;
      data = { ...newData, oldPriceOffered, priceOffered: price };
    }
    order = await OrderModel.update(id, data);
    success(res, null, { order });
  },
  delete: (req, res) => handleDelete(req, res, OrderModel, 'Order'),
};

export default Order;
