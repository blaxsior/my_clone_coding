import e from 'express';
import KEY from './util/key.js';
/** middlewares */
import cookieParser from 'cookie-parser';
// about session
import session from 'express-session';
import MS from 'connect-mongodb-session';
import { authenticate } from './middleware/authenticate.js';

// const MongoStore = MS(session);
// const store = new MongoStore({

// });

/* import routers */
import { router as adminRouter } from './routes/admin.route.js';
import { router as shopRouter } from './routes/shop.route.js';
import { router as authRouter } from './routes/auth.route.js';
import * as errorHandler from './controller/error.controller.js';
/* sql db connection */
import { db } from './db/index.js';
import { UserEntity } from './model/user.model.js';
const server = e();

/* server default middleware setting */
server.set('view engine', 'ejs');
server.use(e.static('public', {
    extensions: ['html', 'htm', 'js']
}));
server.use(e.json());
server.use(e.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(session({
    secret: KEY.SESSION.KEY??"default",
    resave:false,
    saveUninitialized: false
}))
server.use(authenticate);

/* router settings */
server.use('/admin', adminRouter);
server.use(authRouter);
server.use(shopRouter);
server.get('/not-found', errorHandler.get404);
server.use('/', (req, res, next) => {
    res.redirect('/not-found');
});

try {
    await db.$connect();
    {
        let existedUser = await UserEntity.findById(1);
        if (!existedUser) {
            const user = new UserEntity({ name: "blaxsior", email: "hello@hotmail.com" });
            await user.save();
            existedUser = user;
        }
        console.log(existedUser);
    }
    server.listen(KEY.PORT);
} catch (e) {
    if (e instanceof Error) {
        console.error(e.message);
    }
    process.exit(-1);
} 