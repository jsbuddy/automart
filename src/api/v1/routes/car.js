import express from 'express';
import expressJoi from 'express-joi-validator';
import CarsController from '../controllers/car';
import { carPostSchema, carPatchSchema } from '../../../lib/schemas';
import { multerUpload } from '../../../middlewares/multer';
import { cloudinaryConfig } from '../../../config/cloudinary';

const router = express.Router();

router.get('/', CarsController.getAll);
router.get('/:id', CarsController.getOne);
router.post('/', cloudinaryConfig, multerUpload, expressJoi(carPostSchema), CarsController.create);
router.patch('/:id/', expressJoi(carPatchSchema), CarsController.update);
router.delete('/:id/', CarsController.delete);

export default router;
