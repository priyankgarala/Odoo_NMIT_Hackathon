import express from 'express';
import authController from  '../controllers/authController.js';
const router = express.Router();

router.post('/register', authController.register_user);
router.post('/login', authController.login_user);
router.get('/logout', authController.logout_user);

export default router;