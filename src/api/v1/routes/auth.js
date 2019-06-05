import { Router } from 'express';
import expressJoi from 'express-joi-validator';
import AuthController from '../controllers/auth';
import { userSigninSchema, userSignupSchema } from '../../../lib/schemas';

const router = Router();

router.post('/signup', expressJoi(userSignupSchema), AuthController.signup);
router.post('/signin', expressJoi(userSigninSchema), AuthController.signin);

export default router;
