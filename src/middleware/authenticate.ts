import { RequestHandler } from "express";
import { UserEntity } from "../model/user.model.js";

export const authenticate: RequestHandler = async (req, res, next) => {
    const uid = req.cookies['uid'];
    const user = await UserEntity.findById(uid);
    if(user) {
        req.user = user;
    }

    next();
}