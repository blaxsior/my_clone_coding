import e from 'express';
import KEY from './util/key.js';

/* import routers */
import { router as adminRouter } from './routes/admin.js';
import { router as shopRouter } from './routes/shop.js';
import * as errorHandler from './controller/error.js';

const server = e();

/* server default middleware setting */
server.set('view engine', 'ejs');
server.use(e.static('public', {
    extensions: ['html', 'htm', 'js']
}));
server.use(e.json());
server.use(e.urlencoded({ extended: true }));



/* router settings */
server.use('/admin', adminRouter);
server.use(shopRouter);

server.get('/not-found', errorHandler.get404)
server.use('/', (req, res, next) => {
    res.redirect('/not-found');
});
server.listen(KEY.PORT);