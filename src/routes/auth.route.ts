import {Router} from 'express';
import { getLogin,postLogin,postLogout } from '../controller/auth.controller.js';

export const router = Router();

router.get('/login', getLogin);
router.post('/login', postLogin);
router.post('/logout', postLogout);
