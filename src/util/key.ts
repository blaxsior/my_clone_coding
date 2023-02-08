import dotenv from 'dotenv';

dotenv.config();

const KEY = {
    PORT: Number(process.env.PORT)??3000
}

export default KEY;