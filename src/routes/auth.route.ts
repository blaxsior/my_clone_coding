import {Router} from 'express';
import * as AuthCont from '../controller/auth.controller.js';

export const router = Router();

router.get('/login', AuthCont.getLogin);
router.post('/login', AuthCont.postLogin);

router.post('/logout', AuthCont.postLogout);

router.get('/signup', AuthCont.getSignup);
router.post('/signup', AuthCont.postSignup);