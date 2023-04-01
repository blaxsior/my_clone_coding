import { RequestHandler } from "express";
import { UserEntity } from "../model/user.model.js";

export const signupMiddleware: RequestHandler = async (req, res, next) => {
    const uid = req.session.user?.id;
    if(uid) {
        const user = await UserEntity.findById(uid);
        if(user) {
            req.session.user = user;
        }    
    }

    next();
}

export const authMiddleware: RequestHandler = (req, res, next) => {
    if(!req.session.user) return res.redirect('/login');
    next();
}