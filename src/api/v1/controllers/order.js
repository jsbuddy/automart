import OrderModel from '../../../models/order';
import CarModel from '../../../models/car';
import { handleCreate } from '../../../helpers/callback';
import { notfound, unauthorized } from '../../../helpers/response';

const Order = {
  create: (req, res) => {
    const car = CarModel.findOne(req.body.carId);
    if (!car) return notfound(res, 'There is no car with that id');
    handleCreate(OrderModel, { ...req.body, buyer: req.user.id }, res, 'order');
  },
  update: (req, res) => {
    const { id } = req.params;
    let data = req.body;
    let order = OrderModel.findOne(id);
    if (order.status !== 'pending') return unauthorized(res);
    if (data.price) {
      const { newPriceOffered: oldPrice, priceOffered } = order;
      const oldPriceOffered = oldPrice || priceOffered;
      const { price, priceOffered: newPriceOffered, ...newData } = data;
      data = { ...newData, oldPriceOffered, newPriceOffered };
    }
    order = OrderModel.update(id, data);
    res.status(200).json({ success: true, order });
  },
};

export default Order;
