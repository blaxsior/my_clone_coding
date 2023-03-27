import type { RequestHandler } from 'express';
import { db } from '../db/index.js';
import { CartEntity } from '../model/cart.model.js';
import { OrderEntity } from '../model/order.model.js';
import { ProductEntity } from '../model/product.model.js';
  
/* 제품 화면 */
export const getProducts: RequestHandler = async (req, res, next) => {
    const products = await ProductEntity.fetchAll();
    res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true,
        isauthenticated: !!req.session.user
    });
};

/* 디테일 페이지 */
export const getProductDetail: RequestHandler = async (req, res, next) => {
    const { id } = req.params;

    const product = await ProductEntity.findById(Number(id));
    if (product) {
        return res.render('shop/product-detail', {
            prod: product,
            pageTitle: `Detail- ${product.title}`,
            path: '/products',
            activeShop: true,
            productCSS: true,
            isauthenticated: !!req.session.user
        });
    }
    res.redirect('/not-found');
};



/* 메인 화면 */
export const getIndex: RequestHandler = async (req, res, next) => {
    const products = await ProductEntity.fetchAll();
    res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true,
        isauthenticated: !!req.session.user
    });
}

/* 카트 페이지 */
export const getCart: RequestHandler = async (req, res, next) => {
    const user = req.session.user;
    if (user) {
        let cart = await CartEntity.getCartDataByUid(user.id);
        return res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            cart: cart,
            isauthenticated: !!user
        });
    }

    res.redirect('not-found');
}

/* 카트에 제품 담는 버튼 클릭 */
export const postAddToCart: RequestHandler = async (req, res, next) => {
    const { id } = req.body;
    const product = await ProductEntity.findById(id);
    const user = req.session.user;
    console.log('post cart');
    if (product && user) { // 제품 및 유저 존재         
        let cart = await CartEntity.getCartEntityByUid(user.id);
        if (cart) {
            await cart.addProduct(product.id, 1);
        }
    }
    console.log('redirect to cart')
    res.redirect('/cart');
}

/* 카트 내에서 Delete 버튼 클릭하는 경우 */
export const postDeleteFromCart: RequestHandler = async (req, res, next) => {
    const { id } = req.body;
    const product = await ProductEntity.findById(id);
    const user = req.session.user;
    if (product && user) {
        let cart = await CartEntity.getCartEntityByUid(user.id);
        if (cart) {
            await cart.deleteProduct(product.id, 1);
        }
    }

    res.redirect('/cart');
}

export const getOrders: RequestHandler = async (req, res, next) => {
    const user = req.session.user;
    if (user) {
        const orders = await OrderEntity.getOrdersByUid({
            uid: user.id
        });
        return res.render('shop/orders', {
            pageTitle: 'Your Orders',
            path: '/orders',
            orders : orders,
            isauthenticated: !!req.session.user
        });
    }
    res.redirect('not-found');
}

export const postOrder: RequestHandler = async (req, res, next) => {
    const user = req.session.user;
    if (user) {
        const cart = await CartEntity.getCartEntityByUid(user.id);
        if (cart) {
            await db.$transaction(async (tx) => {
                const items = await cart.getCartItems();
                const order = new OrderEntity({ uid: user.id });
                await order.save(items); // 주문 생성
                await cart.deleteProducts();
            }); // await 처리 안해둬서 계속 문제가 발생했었음...
            return res.redirect('orders');
        }
    }
    res.redirect('not-found');
    // res.render('shop/orders', {
    //     pageTitle: 'Your Orders',
    //     path: '/orders',
    //     isauthenticated: !!req.session.user
    // });
}

export const getCheckout: RequestHandler = async (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',
        isauthenticated: !!req.session.user
    });
}