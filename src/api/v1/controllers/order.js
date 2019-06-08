import OrderModel from '../../../models/order';

const Order = {
  create: (req, res) => {
    const order = OrderModel.create({ ...req.body, buyer: req.user.id });
    res.status(201).json({ success: true, order });
  },
  update: (req, res) => {
    const { id } = req.params;
    let data = req.body;
    let order = OrderModel.findOne(id);
    if (data.price) {
      const { newPriceOffered: oldPrice, priceOffered } = order;
      const oldPriceOffered = oldPrice || priceOffered;
      const { price, priceOffered: newPriceOffered, ...newData } = data;
      data = { ...newData, oldPriceOffered, newPriceOffered };
    }
    if (order.status === 'pending') {
      order = OrderModel.update(id, data);
      res.status(200).json({ success: true, order });
    } else {
      res.status(403).json({ success: false });
    }
  },
};

export default Order;
