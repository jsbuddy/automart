import { Router } from 'express';
import car from './routes/car';
import auth from './routes/auth';
import order from './routes/order';
import flag from './routes/flag';
import { authorize } from '../../middlewares/auth';

const router = Router();

router.get('/', (req, res) => res.send('Welcome to Automart API, visit the API documentation (https://automartt.herokuapp.com/docs) to view all endpoints'));
router.use('/auth', auth);
router.use('/car', authorize, car);
router.use('/order', authorize, order);
router.use('/flag', authorize, flag);

export default router;
