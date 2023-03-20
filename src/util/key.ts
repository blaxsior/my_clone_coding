import dotenv from 'dotenv';

dotenv.config();

const KEY = {
    PORT: Number(process.env.PORT) ?? 3000,
    DB: {
        MYSQL: {
            HOST: process.env.MYSQL_HOST,
            USER: process.env.MYSQL_USER,
            DB: process.env.MYSQL_DB,
            PASSWORD: process.env.MYSQL_PASSWORD
        },
    },
    SESSION: {
        KEY: process.env.EXPRESS_SESSION_KEY
    }
}

export default KEY;