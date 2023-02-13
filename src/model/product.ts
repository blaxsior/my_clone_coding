import { ResultSetHeader } from "mysql2";
import { MYSQL_DB } from "../db/mysqldb.js";
export interface IProd {
    id?: number; // auto-increment INT
    title: string;
    imageUrl: string;
    price: number;
    description: string;
}

export class Product {
    id?: number;
    title: string;
    imageUrl: string;
    price: number;
    description: string;
 
    static fromIProd(data: IProd) {
        return new Product(
            data.title,
            data.imageUrl,
            data.price,
            data.description,
            data.id
        );
    }

    constructor(title: string, imageUrl: string, price: string | number, description: string, id?: number) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        const _price = Number(price);
        this.price = isNaN(_price) ? 0 : _price;
        this.description = description;
    }

    setData(title: string, imageUrl: string, price: string, description: string) {
        this.title = title;
        this.imageUrl = imageUrl;
        const _price = Number(price);
        this.price = isNaN(_price) ? 0 : _price;
        this.description = description;
    }

    // private static getId() {
    //     return randomBytes(16).toString('hex');
    // }
    /**
     * @returns Product에 대한 JSON을 반환(원 타입 아님)
     */
    private static async getProducts() {
        const  [arr, _] = await MYSQL_DB.query('SELECT * FROM products') as [IProd[], any];
        // 데이터패킷[], 필드 패킷[] = 칼럼 정의[]
        console.log(arr, _);
        return arr;
    }

    /**
     * 현재 product 인스턴스를 저장.  
     * 기존에 존재하면 값을 덮어쓰고, 존재하지 않으면 새로 넣음
     */
    async save() {
        if(this.id) { 
            // 데이터 + ResultSetHeader 타입을 반환
            const [data, fields] = await MYSQL_DB.query('SELECT 1 FROM products WHERE ID = ?', [this.id]) as [IProd[], any];
            console.log("find", data, fields); // 데이터와 ColumnDefinition 배열을 반환.
            if(data.length > 0) { // 데이터가 이미 존재하는 경우 -> UPDATE
                const [result] = await MYSQL_DB.query("UPDATE PRODUCTS SET title = ?, imageUrl = ?, price = ?, description = ? WHERE id = ?;", 
                [this.title, this.imageUrl, this.price, this.description, this.id]);
                console.log("update", result); // ResultSetHeader 타입을 반환
                return;
            }
        } 
        // 존재하지 않는 데이터의 경우 -> INSERT
        const [rows, _] = await MYSQL_DB.query(
            "INSERT INTO PRODUCTS(title, imageUrl, price, description) VALUES (?, ?, ?, ?)", 
            [this.title, this.imageUrl, this.price, this.description]) as [ResultSetHeader, any];
        console.log("insert", rows, _); // ResultSetHeader을 반환
        this.id = rows.insertId;
    }

    /**
     * 현재 대상의 값을 얻음
     */
    get data(): IProd {
        return structuredClone(this);
        // 아래와 같은 효과
        // return {
        //     desc: this.desc,
        //     id: this.id,
        //     imageUrl: this.imageUrl,
        //     price: this.price,
        //     title: this.title
        // }
    }

    /**
     * readonly로 포장하기 위한 메서드
     * @returns 데이터베이스 내 전체 product
     */
    static async fetchAll(): Promise<readonly IProd[]> {
        return await this.getProducts();
    }

    static async findById(id: number) {
        const [data] = await MYSQL_DB.query("SELECT * FROM products WHERE id = ?",[id]);
        if (Array.isArray(data) && data.length > 0) {
            return data[0] as IProd;
        }
    }

    static async deleteById(id: number) {
        const [result] = await MYSQL_DB.query("DELETE FROM products WHERE id = ?",[id]) as [ResultSetHeader, any];
        // console.log(result); //ResultSetHeader 반환
    }
}