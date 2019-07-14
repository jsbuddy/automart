import { Router } from 'express';
import expressJoi from 'express-joi-validator';
import AuthController from '../controllers/auth';
import { userSigninSchema, userSignupSchema } from '../../../lib/schemas';
import { authorize } from '../../../middlewares/auth';

const router = Router();

router.post('/signup', expressJoi(userSignupSchema), AuthController.signup);
router.post('/signin', expressJoi(userSigninSchema), AuthController.signin);
router.get('/user', authorize, AuthController.getUser);
router.delete('/user/:id', authorize, AuthController.deleteUser);

export default router;
