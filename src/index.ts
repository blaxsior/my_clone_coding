import e from 'express';
import KEY from './util/key.js';
import cookieParser from 'cookie-parser';
import { authenticate } from './middleware/authenticate.js';

/* import routers */
import { router as adminRouter } from './routes/admin.route.js';
import { router as shopRouter } from './routes/shop.route.js';
import * as errorHandler from './controller/error.controller.js';
/* sql db connection */
import { mongodbConn } from './db/mongo.index.js';
import { UserEntity } from './model/user.js';
const server = e();

/* server default middleware setting */
server.set('view engine', 'ejs');
server.use(e.static('public', {
    extensions: ['html', 'htm', 'js']
}));
server.use(e.json());
server.use(e.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(authenticate);

/* router settings */
server.use('/admin', adminRouter);
server.use(shopRouter);

server.get('/not-found', errorHandler.get404);
server.use('/', (req, res, next) => {
    res.redirect('/not-found');
});

try {
    await mongodbConn();
    // {
    //     let existedUser = await UserEntity.findByUserInfo({name: "blaxsior"});
    //     if (!existedUser) {
    //         const user = new UserEntity({ name: "blaxsior", email: "hello@hotmail.com" });
    //         await user.save();
    //         existedUser = user; 
    //     }
    //     console.log(existedUser);
    // }
    server.listen(KEY.PORT);
} catch (e) {
    if (e instanceof Error) {
        console.error(e.message);
    }
    process.exit(-1);
} 