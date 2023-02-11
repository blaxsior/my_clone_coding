import { Router } from "express";
import { getCart, getCheckout, getIndex, getOrders, getProductDetail, getProducts, postAddToCart, postDeleteFromCart } from "../controller/shop.js";
export const router = Router();

// / (index)
router.get('/', getIndex);

// /products/:id
router.get('/products/:id', getProductDetail);

// /products
router.get('/products', getProducts);


// /cart
router.get('/cart', getCart);
router.post('/cart', postAddToCart);
// /cart-delete-item POST
router.post('/cart-delete-item', postDeleteFromCart);

// /orders
router.get('/orders',getOrders);

// /checkout
router.get('/checkout', getCheckout);