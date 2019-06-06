import express from 'express';
import expressJoi from 'express-joi-validator';
import CarsController from '../controllers/car';
import { carSchema } from '../../../lib/schemas';
import { multerUpload } from '../../../middlewares/multer';
import { cloudinaryConfig } from '../../../config/cloudinary';

const router = express.Router();

router.get('/', CarsController.getAll);
router.get('/:id', CarsController.getOne);
router.post('/', cloudinaryConfig, multerUpload, expressJoi(carSchema), CarsController.create);
router.patch('/:id/', CarsController.update);
router.delete('/:id/', CarsController.delete);

export default router;
