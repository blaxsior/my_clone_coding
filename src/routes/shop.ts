import { Router } from "express";

export const router = Router();

router.get('/', (req, res, next) => {
  res.render('shop', { pageTitle: 'shop', prods: [{ title: 'apple', price: 19.99, desc: 'this is test!' }, { title: 'apple', price: 19.99, desc: 'this is test!' }, { title: 'apple', price: 19.99, desc: 'this is test!' }] });
});