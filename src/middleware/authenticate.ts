import { RequestHandler } from "express";
import { UserEntity } from "../model/user.js";

export const authenticate: RequestHandler = async (req, res, next) => {
    const uid = req.cookies['uid'];
    const user = await UserEntity.findById(uid);
    if(user) {
        req.user = user;
        console.log(`user ${user.name} : ${user.email}, [${req.method}: ${req.url}]`);
    } else {
        console.log(`no user`);
    }
    next();
}