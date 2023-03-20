import { RequestHandler } from "express";

export const getLogin: RequestHandler = (req,res,next) => {
    console.log(req.session);
    return res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isauthenticated: !!req.user
    });
};

export const postLogin: RequestHandler = (req,res,next) => {
    // res.cookie('uid','1',{
    //     maxAge: 3600,
    //     // httpOnly: true
    // }).redirect('/');

    req.session.uid = 1;
    res.redirect('/');
};