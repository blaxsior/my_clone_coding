import type { RequestHandler } from "express";

export const get404: RequestHandler = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: "Page Not Found", 
        path:'/not-found',
        isauthenticated: !!req.user});
}