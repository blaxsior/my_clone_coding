import mysql from 'mysql2/promise';
import KEY from '../util/key.js';


export class MYSQL_DB {
// 여러 유저에 대응해야 되므로 pool로 연결
    private static pool: mysql.Pool;

    static init() {
        this.pool = mysql.createPool({
            host: KEY.DB.MYSQL.HOST,
            user: KEY.DB.MYSQL.USER,
            password: KEY.DB.MYSQL.PASSWORD,
            database: KEY.DB.MYSQL.DB
        });
    }

    static async query(sql: string, values?: any) {
        return await this.pool.query(sql, values);
    }

    static async execute(sql: string, values?: any) {
        return await this.pool.execute(sql, values);
    }
}