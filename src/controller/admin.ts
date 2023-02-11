import type { RequestHandler } from "express";
import { Cart } from "../model/cart.js";
import { Product } from "../model/product.js";

// /admin/add-product GET
export const getAddProduct: RequestHandler = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        product: {},
        editing: false
    });  
}

// /admin/add-product POST
export const postAddProduct: RequestHandler = async (req, res, next) => {
    const {title, imageUrl, price, description} = req.body;
    const product = new Product(title, imageUrl, price, description);
    await product.save();
    res.redirect('/'); 
}

// /admin/edit-product/:id?edit=true GET
export const getEditProduct: RequestHandler = async (req, res, next) => {
    const {id} = req.params;
    const {edit} = req.query;

    if(!edit) {
        return res.redirect('/');
    }

    const prod = await Product.findById(id);
    if(prod) {
        return res.render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/products',
            product: prod,
            editing: edit
        }); 
    }
    res.redirect('/not-found');
}

// /admin/edit-product POST
export const postEditProduct: RequestHandler = async (req, res, next) => {
    const {id, title, imageUrl, price, description} = req.body;

    const prod = await Product.findById(id);
    if(prod) {
        const product = Product.fromIProd(prod);

        product.setData(title,imageUrl,price,description);
        await product.save();
        return res.redirect('/admin/products');
    }
    res.redirect('/');
}

// /admin/products
export const getProducts: RequestHandler = async (req, res, next) => {
    const products = await Product.fetchAll();
    res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        hasProducts: products.length > 0
    });
};

// /admin/delete-product/:id POST
// 원래는 delete method 쓰려고 했는데, 현재 실험적으로만 지원되는 수준이라서 POST로 처리
export const postDeleteProduct: RequestHandler = async (req, res, next) => {
    const {id} = req.body;

    const dProd = await Product.deleteById(id);
    if(dProd)
    {
        await Cart.deleteProduct(id, dProd.price);
    }
    return res.redirect('/admin/products');
}