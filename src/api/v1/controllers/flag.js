import FlagModel from '../../../models/flag';
import { handleCreate } from '../../../helpers/callback';
import { success } from '../../../helpers/response';

const Flag = {
  create: (req, res) => handleCreate(FlagModel, { ...req.body, creator: req.user.id }, res, 'flag'),
  getAll: async (req, res) => {
    const flags = await FlagModel.findAll();
    return success(res, null, { flags });
  },
  delete: async (req, res) => {
    const { id } = req.params;
    await FlagModel.delete(id);
    return success(res, 'Flag deleted successfully', { success: true });
  },
};

export default Flag;
