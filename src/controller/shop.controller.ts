import type { RequestHandler } from 'express';
import { CartEntity } from '../model/cart.js';
import { OrderEntity } from '../model/order.js';
import { ProductEntity } from '../model/product.js';

/* 제품 화면 */
export const getProducts: RequestHandler = async (req, res, next) => {
    const products = await ProductEntity.fetchAll();
    res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Products',
        path: '/products',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
};

/* 디테일 페이지 */
export const getProductDetail: RequestHandler = async (req, res, next) => {
    const { id } = req.params;
    const product = await ProductEntity.findById(id);

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
    const user = req.user;

    const products = await ProductEntity.fetchAll();
    res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
}

/* 카트 페이지 */
export const getCart: RequestHandler = async (req, res, next) => {
    const user = req.user;
    if (user) {
        let cart = await CartEntity.findByUid(user._id!);
        if (!cart) {
            cart = new CartEntity({ uid: user._id });
            await cart.save();
        }
        let cartdata = await cart.getCartData();
        return res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            cart: cartdata
        });
    }

    res.redirect('not-found');
}

/* 카트에 제품 담는 버튼 클릭 */
export const postAddToCart: RequestHandler = async (req, res, next) => {
    const { id } = req.body;
    const product = await ProductEntity.findById(id);
    const user = req.user;
    if (product && user) { // 제품 및 유저 존재
        let cart = await CartEntity.findByUid(user._id!);
        if (!cart) {
            cart = new CartEntity({ uid: user._id });
            await cart.save();
        }
        await cart.addProduct(product._id!, 1);
    }
    res.redirect('/cart');
}

/* 카트 내에서 Delete 버튼 클릭하는 경우 */
export const postDeleteFromCart: RequestHandler = async (req, res, next) => {
    const { id } = req.body;
    const product = await ProductEntity.findById(id);
    const user = req.user;
    if (product && user) {
        let cart = await CartEntity.findByUid(user._id!);
        if (cart) {
            await cart.deleteProduct(product._id!, 1);
        }
    }

    res.redirect('/cart');
}

export const getOrders: RequestHandler = async (req, res, next) => {
    const user = req.user;
    if (user) {
        const orders = await OrderEntity.getOrdersByUid({
            uid: user._id!
        });

        console.log(orders);
        return res.render('shop/orders', {
            pageTitle: 'Your Orders',
            path: '/orders',
            orders: orders
        });
    }
    res.redirect('not-found');
}

export const postOrder: RequestHandler = async (req, res, next) => {
    const user = req.user;
    if (user) {
        const cart = await CartEntity.findByUid(user._id!);
        if (cart) {
            const itemlist = cart.items.map(it => it.pid);
            const products = await ProductEntity.findManyById(itemlist);
            const orderItems = cart.items.map(it => ({
                product: products.find(prod=> it.pid.equals(prod._id))!,
                quantity: it.quantity
            }))

            const order = new OrderEntity({ uid: user._id, items: orderItems});
            await order.save();
            await cart.deleteProducts();
        }
    }
    res.redirect('/orders');
}

// export const getCheckout: RequestHandler = async (req, res, next) => {
//     res.render('shop/checkout', {
//         pageTitle: 'Checkout',
//         path: '/checkout'
//     });
// }