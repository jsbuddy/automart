import express from 'express';
import expressJoi from 'express-joi-validator';
import OrderController from '../controllers/order';
import { orderSchema } from '../../../lib/schemas';

const router = express.Router();

router.post('/', expressJoi(orderSchema), OrderController.create);
router.patch('/:id', OrderController.update);
router.delete('/:id', OrderController.delete);

export default router;
