import { Router } from 'express';
import car from './routes/car';
import auth from './routes/auth';
import order from './routes/order';
import { authorize } from '../../middlewares/auth';

const router = Router();

router.use('/auth', auth);
router.use('/car', authorize, car);
router.use('/order', authorize, order);

export default router;
