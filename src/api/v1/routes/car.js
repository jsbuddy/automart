import express from 'express';
import expressJoi from 'express-joi-validator';
import CarsController from '../controllers/car';
import { carPostSchema, carPatchSchema, carGetSchema } from '../../../lib/schemas';
import { multerUpload } from '../../../middlewares/multer';
import { cloudinaryConfig } from '../../../config/cloudinary';
import { admin } from '../../../middlewares/auth';

const router = express.Router();

router.get('/', expressJoi(carGetSchema), CarsController.getAll);
router.get('/:id', CarsController.getOne);
router.post('/', cloudinaryConfig, multerUpload, expressJoi(carPostSchema), CarsController.create);
router.patch('/:id/', expressJoi(carPatchSchema), CarsController.update);
router.delete('/:id/', admin, CarsController.delete);

export default router;
