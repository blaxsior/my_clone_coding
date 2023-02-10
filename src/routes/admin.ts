import { Router } from "express";
import {postAddProduct, getAddProduct, getProducts} from '../controller/admin.js';

export const router = Router();
// /admin/add-product => GET
router.get('/add-product', getAddProduct);

// /admin/products => GET
router.get('/products', getProducts);

// /admin/add-product => POST
router.post('/add-product', postAddProduct);