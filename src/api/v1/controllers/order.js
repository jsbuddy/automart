import OrderModel from '../../../models/order';
import CarModel from '../../../models/car';
import { handleCreate } from '../../../helpers/callback';
import { notfound, success, notallowed } from '../../../helpers/response';

const Order = {
  create: (req, res) => {
    const car = CarModel.findOne(req.body.carId);
    if (!car) return notfound(res, 'Car not found');
    handleCreate(OrderModel, { ...req.body, buyer: req.user.id }, res, 'order');
  },
  update: (req, res) => {
    const { id } = req.params;
    let data = req.body;
    let order = OrderModel.findOne(id);
    if (!order) return notfound(res, 'Order not found');
    if (order.status !== 'pending') return notallowed(res);
    if (data.price) {
      const oldPriceOffered = order.priceOffered;
      const { price, ...newData } = data;
      data = { ...newData, oldPriceOffered, priceOffered: price };
    }
    order = OrderModel.update(id, data);
    success(res, null, { order });
  },
};

export default Order;
