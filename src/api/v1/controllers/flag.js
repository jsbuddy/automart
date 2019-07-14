import FlagModel from '../../../models/flag';
import { handleCreate, handleDelete } from '../../../helpers/callback';
import { success } from '../../../helpers/response';

const Flag = {
  create: (req, res) => {
    const { carId, reason, description } = req.body;
    return handleCreate(FlagModel, {
      carId, reason, description, creator: req.user.id,
    }, res);
  },
  getAll: async (req, res) => {
    const flags = await FlagModel.findAll();
    return success(res, undefined, flags);
  },
  delete: (req, res) => handleDelete(req, res, FlagModel),
};

export default Flag;
