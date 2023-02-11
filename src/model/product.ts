
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { randomBytes } from 'crypto';

export interface IProd {
    id: string;
    title: string;
    imageUrl: string;
    price: number;
    desc: string;
}

export class Product {
    private static filename = resolve('src', 'db', 'db.json');
    id: string;
    title: string;
    imageUrl: string;
    price: number;
    desc: string;

    static fromIProd(data: IProd) {
        return new Product(
            data.title,
            data.imageUrl,
            data.price,
            data.desc,
            data.id
        );
    }

    constructor(title: string, imageUrl: string, price: string | number, description: string, id?: string) {
        this.id = id ?? Product.getId();
        this.title = title;
        this.imageUrl = imageUrl;
        const _price = Number(price);
        this.price = isNaN(_price) ? 0 : _price;
        this.desc = description;
    }

    setData(title: string, imageUrl: string, price: string, description: string) {
        this.title = title;
        this.imageUrl = imageUrl;
        const _price = Number(price);
        this.price = isNaN(_price) ? 0 : _price;
        this.desc = description;
    }

    private static getId() {
        return randomBytes(16).toString('hex');
    }
    /**
     * @returns Product에 대한 JSON을 반환(원 타입 아님)
     */
    private static async getProducts() {
        const file = await readFile(Product.filename);
        let arr: IProd[];
        try {
            arr = JSON.parse(file.toString('utf8'));
        }
        catch (e) {
            arr = [];
        }

        return arr;
    }
    /**
     * 현재 product 인스턴스를 저장.  
     * 기존에 존재하면 값을 덮어쓰고, 존재하지 않으면 새로 넣음
     */
    async save() {
        const arr = await Product.getProducts();
        const idx = arr.findIndex(it => it.id === this.id);
        if(idx > -1) { // 존재하면
            arr[idx] = this.data;
        }
        else {
            arr.push(this);
        }
        await writeFile(Product.filename, JSON.stringify(arr));
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

    static async findById(id: string) {
        const prod_list = await this.fetchAll();
        const result = prod_list.find(prod => prod.id === id);
        return result;
    }

    static async deleteById(id: string) {
        const prod_list = await this.getProducts();
        const dElemIdx = prod_list.findIndex(it => it.id === id);
        if(dElemIdx > -1) { // 존재한다면 -> 제거하고 데이터베이스에 반영
            const dElem = prod_list.splice(dElemIdx, 1)[0];
            await writeFile(Product.filename, JSON.stringify(prod_list));
            return dElem;
        }
    }
}