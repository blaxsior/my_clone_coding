import { Router } from "express";
import {postAddProduct, getAddProduct, getProducts, getEditProduct, PostEditProduct} from '../controller/admin.js';

export const router = Router();
// /admin/add-product => GET
router.get('/add-product', getAddProduct);

// /admin/add-product => POST
router.post('/add-product', postAddProduct);

// /admin/products => GET
router.get('/products', getProducts);

// /admin/edit-product/:id => GET
router.get('/edit-product/:id', getEditProduct);

// /admin/edit-product/ => POST
router.post('/edit-product/:id', PostEditProduct);


