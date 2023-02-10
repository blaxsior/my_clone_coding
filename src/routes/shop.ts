import { Router } from "express";
import { getCart, getCheckout, getIndex, getProducts } from "../controller/shop.js";
export const router = Router();

// / (index)
router.get('/', getIndex);

// /products
router.get('/products', getProducts);

// /cart
router.get('/cart', getCart);

// /checkout
router.get('/checkout', getCheckout);