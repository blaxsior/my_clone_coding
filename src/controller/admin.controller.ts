import type { RequestHandler } from "express";
import { ProductEntity } from "../model/product.model.js";

// /admin/add-product GET
export const getAddProduct: RequestHandler = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        product: {},
        editing: false,
        isauthenticated: !!req.session.user
    });
}

// /admin/add-product POST
export const postAddProduct: RequestHandler = async (req, res, next) => {
    const { title, imageUrl, price, description } = req.body;
    const product = new ProductEntity({
        title,
        imageUrl,
        price,
        description,
        uid: req.session.user?.id,
    });
    await product.save();
    // const product = new ProductEntity({title, imageUrl, price, description,uid: req.user?.id});
    // await product.save();
    res.redirect('/');
}

// /admin/edit-product/:id?edit=true GET
export const getEditProduct: RequestHandler = async (req, res, next) => {
    const { id } = req.params;
    const { edit } = req.query;
    if (!edit) {
        return res.redirect('/');
    }
    // || req.user?.id != req.cookies['uid'] 같은 authorization 기능은 나중에 고려

    const prod = await ProductEntity.findById(Number(id));
    if (prod) {
        return res.render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/products',
            product: prod,
            editing: edit,
            isauthenticated: !!req.session.user
        });
    }
    res.redirect('/not-found');
}

// /admin/edit-product POST
export const postEditProduct: RequestHandler = async (req, res, next) => {
    console.log("body", req.body);

    const { id, title, imageUrl, price, description } = req.body;

    const product = await ProductEntity.findById(Number(id));
    if (product) {
        product.setData({title, imageUrl, price, description});
        await product.save();
        return res.redirect('/admin/products');
    }
    res.redirect('/');
}

// /admin/products
export const getProducts: RequestHandler = async (req, res, next) => {
    const uid = req.session.user?.id;
    console.log('uid = ', uid);
    const products = uid
        ? await ProductEntity.findManyByUid(uid)
        : [];
    res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        hasProducts: products.length > 0,
        isauthenticated: !!req.session.user
    });
};

// /admin/delete-product/:id POST
// 원래는 delete method 쓰려고 했는데, 현재 실험적으로만 지원되는 수준이라서 POST로 처리
export const postDeleteProduct: RequestHandler = async (req, res, next) => {
    const { id } = req.body;

    const dProd = await ProductEntity.findById(id);
    if (dProd) {
        await ProductEntity.deleteById(dProd.id!);
       // await CartEntity.deleteProduct(id, dProd.price);
    }

    return res.redirect('/admin/products');
}