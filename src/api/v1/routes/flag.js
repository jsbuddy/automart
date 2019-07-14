import express from 'express';
import expressJoi from 'express-joi-validator';
import FlagController from '../controllers/flag';
import { flagSchema } from '../../../lib/schemas';
// import { admin } from '../../../middlewares/auth';

const router = express.Router();

router.get('/', FlagController.getAll);
router.post('/', expressJoi(flagSchema), FlagController.create);
router.delete('/:id', FlagController.delete);

export default router;
