import OrderModel from '../../../models/order';

const Order = {
  create: (req, res) => {
    const order = OrderModel.create({ ...req.body, buyer: req.user.id });
    res.status(201).json({ success: true, order });
  },
  update: (req, res) => {
    const { id } = req.params;
    const data = req.body;
    let order = OrderModel.findOne(id);
    if (order.status === 'pending') {
      order = OrderModel.update(id, data);
      res.status(200).json({ success: true, order });
    } else {
      res.status(403).json({ success: false });
    }
  },
};

export default Order;
