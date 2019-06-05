import express from 'express';
import expressJoi from 'express-joi-validator';
import CarsController from '../controllers/car';
import { carSchema } from '../../../lib/schemas';

const router = express.Router();

router.get('/', CarsController.getAll);
router.get('/:id', CarsController.getOne);
router.post('/', expressJoi(carSchema), CarsController.create);
router.patch('/:id/', CarsController.update);
router.delete('/:id/', CarsController.delete);

export default router;
