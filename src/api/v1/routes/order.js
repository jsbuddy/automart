import express from 'express';
import expressJoi from 'express-joi-validator';
import OrderController from '../controllers/order';
import { orderSchema, orderPatchSchema } from '../../../lib/schemas';
import { admin } from '../../../middlewares/auth';

const router = express.Router();

router.get('/', OrderController.getAll);
router.get('/buyer/', OrderController.getAllByBuyer);
router.get('/buyer/:id', OrderController.getAllByBuyer);
router.get('/car/:id', OrderController.getAllByCar);
router.get('/:id', OrderController.getOne);
router.post('/', expressJoi(orderSchema), OrderController.create);
router.patch('/:id', expressJoi(orderPatchSchema), OrderController.update);
router.patch('/:id/price', expressJoi(orderPatchSchema), OrderController.update);
router.delete('/:id', admin, OrderController.delete);

export default router;
