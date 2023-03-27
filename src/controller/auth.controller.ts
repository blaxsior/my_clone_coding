import { RequestHandler } from "express";
import { db } from "../db/index.js";
import { UserEntity } from "../model/user.model.js";

export const getLogin: RequestHandler = async (req, res, next) => {
    return res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isauthenticated: !!req.session.user
    });
};

export const postLogin: RequestHandler = async (req, res, next) => {
    const {email, password} = req.body;
    if(email && password) {
        const user = await UserEntity.findByAuthInfo(email,password);
        if (user) {
            req.session.user = user;
            return req.session.save((e) => {
                res.redirect('/');
            }); // 경우에 따라 데이터베이스에 반영되는 속도보다 redirect가 빠를 수 있다.
            // save 메서드를 이용하여 실제로 반영된 이후에 처리하도록 수정한다.
        }
    }

    res.redirect('/login');
};

export const postLogout: RequestHandler = async (req, res, next) => {
    return req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
};
export const getSignup: RequestHandler = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isauthenticated: false
    });
};
export const postSignup: RequestHandler = async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body; // body에서 정보 추출
    // do something
    const existedUser = await db.user.findFirst({
        where: {
            email: email
        }
    });
    /* 유저가 있다면 무시 */
    // if (existedUser) {
    //     return res.redirect('/signup');
    // }

    if (!existedUser && name && email && password) {
        console.log(password);
        const user = new UserEntity({
            name,
            email,
            password
        });
        await user.save();
        return res.redirect('/login');
    }

    res.redirect('/signup');
};