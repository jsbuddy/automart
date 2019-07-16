import express from 'express';
import expressJoi from 'express-joi-validator';
import CarsController from '../controllers/car';
import { carPostSchema, carPatchSchema, carPatchPriceSchema, carPatchStatusSchema, carGetSchema } from '../../../lib/schemas';
import { multerUpload } from '../../../middlewares/multer';
import { cloudinaryConfig } from '../../../config/cloudinary';
import { admin } from '../../../middlewares/auth';

const router = express.Router();

router.get('/', expressJoi(carGetSchema), CarsController.getAll);
router.get('/owner', CarsController.getAllByOwner);
router.get('/owner/:id', CarsController.getAllByOwner);
router.get('/:id', CarsController.getOne);
router.post('/', cloudinaryConfig, multerUpload, expressJoi(carPostSchema), CarsController.create);
router.patch('/:id', expressJoi(carPatchSchema), CarsController.update);
router.patch('/:id/price', expressJoi(carPatchPriceSchema), CarsController.update);
router.patch('/:id/status', expressJoi(carPatchStatusSchema), CarsController.update);
router.delete('/:id', admin, cloudinaryConfig, CarsController.delete);

export default router;
