import type { RequestHandler } from 'express';
import { Cart, type CartItem, type CartItems } from '../model/cart.js';
import { IProd, Product } from '../model/product.js';

/* 제품 화면 */
export const getProducts: RequestHandler = async (req, res, next) => {
    const products = await Product.fetchAll();
    res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
};

export const getProductDetail: RequestHandler = async (req, res, next) => {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (product) {
        return res.render('shop/product-detail', {
            prod: product,
            pageTitle: `Detail- ${product.title}`,
            path: '/products',
            activeShop: true,
            productCSS: true
        });
    }
    res.redirect('/not-found');
};



/* 메인 화면 */
export const getIndex: RequestHandler = async (req, res, next) => {
    const products = await Product.fetchAll();
    res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
}

export const getCart: RequestHandler = async (req, res, next) => {
    const cart = await Cart.getCart();
    const products = await Product.fetchAll();

    const cartProducts: Pick<CartItems, 'totalPrice'> & {
        items: (IProd & CartItem)[]
    } = {
        items: [],
        totalPrice: cart.totalPrice
    };

    for (const cartItem of cart.items) {
        const product = products.find(it => it.id === cartItem.id);
        if (product) { // 대응되는 제품이 존재하는 경우
            const item: IProd & CartItem = {
                ...product,
                count: cartItem.count
            };
            cartProducts.items.push(item);
        }
    }

    res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        cart: cartProducts
    });
}

export const postAddToCart: RequestHandler = async (req, res, next) => {
    const { id } = req.body;
    const product = await Product.findById(id);

    if (product && !isNaN(product.price)) { // 제품이 존재 & 가격이 정상적인 경우
        await Cart.addProduct(id, product.price);
    }

    res.redirect('/cart');
}

export const postDeleteFromCart: RequestHandler = async (req, res, next) => {
    const { id } = req.body;
    const product = await Product.findById(id);
    if (product) {
        await Cart.deleteProduct(id, product.price);
    }

    res.redirect('/cart');
}

export const getOrders: RequestHandler = async (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders'
    });
}

export const getCheckout: RequestHandler = async (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
}