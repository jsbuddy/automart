import FlagModel from '../../../models/car';

const Flag = {
  create: (req, res) => {
    const flag = FlagModel.create({ ...req.body, owner: req.user.id });
    res.status(201).json({ success: true, flag });
  },
};

export default Flag;
