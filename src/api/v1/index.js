import { Router } from 'express';
import car from './routes/car';
import auth from './routes/auth';
import { authorize } from '../../middlewares/auth';

const router = Router();

router.use('/auth', auth);
router.use('/car', authorize, car);

export default router;
