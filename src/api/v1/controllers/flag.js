import FlagModel from '../../../models/flag';
import { handleCreate } from '../../../helpers/callback';
import { success } from '../../../helpers/response';

const Flag = {
  create: (req, res) => handleCreate(FlagModel, { ...req.body, creator: req.user.id }, res, 'flag'),
  getAll: (req, res) => {
    const flags = FlagModel.findAll();
    return success(res, null, { flags });
  },
};

export default Flag;
