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
        return req.session.save((e) => {
            res.redirect('/');
        }); // 경우에 따라 데이터베이스에 반영되는 속도보다 redirect가 빠를 수 있다.
        // save 메서드를 이용하여 실제로 반영된 이후에 처리하도록 수정한다.
    }
    res.redirect('/login');
};

export const postLogout: RequestHandler = async (req, res, next) => {
    return req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}; 