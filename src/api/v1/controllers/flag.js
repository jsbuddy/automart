import FlagModel from '../../../models/car';
import { handleCreate } from '../../../helpers/callback';

const Flag = {
  create: (req, res) => handleCreate(FlagModel, { ...req.body, owner: req.user.id }, res, 'flag'),
};

export default Flag;
