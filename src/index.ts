import e from 'express';
import KEY from './util/key.js';
/** middlewares */
import cookieParser from 'cookie-parser';
// about session
import session from 'express-session';
import MS from 'connect-mongodb-session';
import { authMiddleware, signupMiddleware } from './middleware/authenticate.js';

const MongoStore = MS(session);
const store = new MongoStore({
    uri: `mongodb+srv://${KEY.DB.mongodb.USER}:${KEY.DB.mongodb.PASSWORD}@node-mongo.no4qmpi.mongodb.net/${KEY.DB.mongodb.DB}?retryWrites=true&w=majority`,
    collection: 'sessions',
});

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
    cookie: {
        httpOnly: true,
        maxAge: 3600 * 60
    },
    secret: KEY.SESSION.KEY??"default",
    resave:false,
    saveUninitialized: false,
    store: store
}))
server.use(signupMiddleware);

/* router settings */
server.use('/admin', authMiddleware ,adminRouter);
server.use(authRouter);
server.use(shopRouter);
server.get('/not-found', errorHandler.get404);
server.use('/', (req, res, next) => {
    res.redirect('/not-found');
});

try {
    await db.$connect();
    server.listen(KEY.PORT);
} catch (e) {
    if (e instanceof Error) {
        console.error(e.message);
    }
    process.exit(-1);
} 