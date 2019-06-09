import OrderModel from '../../../models/order';
import { handleCreate } from '../../../helpers/callback';

const Order = {
  create: (req, res) => handleCreate(OrderModel, { ...req.body, buyer: req.user.id }, res, 'order'),
  update: (req, res) => {
    const { id } = req.params;
    let data = req.body;
    let order = OrderModel.findOne(id);
    if (order.status === 'pending') {
      if (data.price) {
        const { newPriceOffered: oldPrice, priceOffered } = order;
        const oldPriceOffered = oldPrice || priceOffered;
        const { price, priceOffered: newPriceOffered, ...newData } = data;
        data = { ...newData, oldPriceOffered, newPriceOffered };
      }
      order = OrderModel.update(id, data);
      res.status(200).json({ success: true, order });
    } else {
      res.status(401).json({ success: false });
    }
  },
};

export default Order;
