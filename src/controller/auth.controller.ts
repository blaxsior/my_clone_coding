import { RequestHandler } from "express";
import { UserEntity } from "../model/user.model.js";

export const getLogin: RequestHandler = async (req,res,next) => {
    return res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isauthenticated: !!req.session.user
    });
};

export const postLogin: RequestHandler = async (req,res,next) => {
    // res.cookie('uid','1',{
    //     maxAge: 3600,
    //     // httpOnly: true
    // }).redirect('/');

    const user = await UserEntity.findById(1);
    if(user) {
        req.session.user = user;
    }

    // req.session.user = 
    res.redirect('/');
};

export const postLogout: RequestHandler = async (req, res, next) => {
    return req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}; 