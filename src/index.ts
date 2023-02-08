import e from 'express';
import KEY from './util/key.js';

/* import routers */
import {router as adminRouter} from './routes/admin.js';
import {router as shopRouter} from './routes/shop.js';
import { resolve } from 'path';

const server = e();

/* server default middleware setting */
server.set('view engine','ejs');
server.use(e.static('public', {
    extensions:['html', 'htm', 'js']
})); 
server.use(e.json()); 
server.use(e.urlencoded({extended: true}));



/* router settings */
server.use('/admin', adminRouter);
server.use(shopRouter);

server.use((req, res, next) => {
    res.status(404).render('404', {pageTitle: "Page Not Found"});
});

server.listen(KEY.PORT);