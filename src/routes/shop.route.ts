import { Router } from "express";
import * as shopController from "../controller/shop.controller.js";
export const router = Router();

// / (index)
router.get('/', shopController.getIndex);

// /products/:id
router.get('/products/:id', shopController.getProductDetail);

// /products
router.get('/products', shopController.getProducts);


// /cart
router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postAddToCart);
// /cart-delete-item POST
router.post('/cart-delete-item', shopController.postDeleteFromCart);

// /orders
router.get('/orders',shopController.getOrders);

// /create-order POST
router.post('/create-order', shopController.postOrder);

// // /checkout
// router.get('/checkout', shopController.getCheckout);