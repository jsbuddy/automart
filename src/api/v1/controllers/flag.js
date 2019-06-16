import FlagModel from '../../../models/flag';
import { handleCreate } from '../../../helpers/callback';
import { success } from '../../../helpers/response';

const Flag = {
  create: (req, res) => handleCreate(FlagModel, { ...req.body, creator: req.user.id }, res, 'flag'),
  getAll: async (req, res) => {
    const flags = await FlagModel.findAll();
    return success(res, null, { flags });
  },
};

export default Flag;
