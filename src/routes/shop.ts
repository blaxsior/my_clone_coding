import { Router } from "express";
import { getCart, getCheckout, getIndex, getOrders, getProductDetail, getProducts, postAddToCart } from "../controller/shop.js";
export const router = Router();

// / (index)
router.get('/', getIndex);

// /products/:id
router.get('/products/:id', getProductDetail);

// /products
router.get('/products', getProducts);

// /products:id
// router.delete('/products/delete/:id', deleteProduct);


// /cart
router.get('/cart', getCart);
router.post('/cart', postAddToCart);
// /orders
router.get('/orders',getOrders);

// /checkout
router.get('/checkout', getCheckout);