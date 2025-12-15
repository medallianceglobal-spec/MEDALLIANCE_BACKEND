// src/routes/auth.routes.js
import { Router } from 'express';
import { login } from '../controllers/authenticationControllers/login.controller.js';
import { signup } from '../controllers/authenticationControllers/signup.controller.js';
import { googleAuth } from '../controllers/authenticationControllers/googleAuth.controller.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleAuth)

export default router;
