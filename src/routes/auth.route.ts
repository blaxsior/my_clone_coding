import {Router} from 'express';
import { getLogin,postLogin } from '../controller/auth.controller.js';

export const router = Router();

router.get('/login', getLogin);
router.post('/login', postLogin)

