import { db } from '../db/index.js';
import { Product as IProduct } from ".prisma/client";
import type { Optional } from '../interface/index.js';
// export interface IProd {
//     id?: number; // auto-increment INT
//     title: string;
//     imageUrl: string;
//     price: number;
//     description: string;
// }
export class ProductEntity implements IProduct {
    id!: number;
    title!: string;
    price!: number;
    description!: string | null;
    imageUrl!: string | null;
    uid!: number | null;

    constructor(data: Optional<IProduct, 'id' | 'uid'>) {
        this.id = data.id ?? -1;
        this.setData(data);
    }

    setData(data: Omit<IProduct, 'id'|'uid'> & Partial<Pick<IProduct,'uid'>>) {
        this.title = data.title;
        this.imageUrl = data.imageUrl;
        const _price = Number(data.price);
        this.price = isNaN(_price) ? 0 : _price;
        this.description = data.description;
        this.uid = data.uid ?? this.uid ?? null;
    }

    // private static getId() {
    //     return randomBytes(16).toString('hex');
    // }
    /**
     * @returns Product에 대한 JSON을 반환(원 타입 아님)
     */
    private static async getProducts() {
        return await db.product.findMany();
    }

    /**
     * 현재 product 인스턴스를 저장.  
     * 기존에 존재하면 값을 덮어쓰고, 존재하지 않으면 새로 넣음
     */
    async save() {
        if (this.id > -1) { // 이미 존재
            await db.product.update({
                data: {
                    title: this.title,
                    price: this.price,
                    description: this.description,
                    imageUrl: this.imageUrl,
                    uid: this.uid
                },
                where: {
                    id: this.id
                }
            });
        } else { // 존재하지 않는 상품의 경우
            const { id, uid } = await db.product.create({
                data: {
                    title: this.title,
                    price: this.price,
                    description: this.description,
                    imageUrl: this.imageUrl,
                    uid: this.uid
                }
            });
            this.id = id;
            this.uid = uid;
        }
    }
    
    /**
     * 현재 대상의 값을 얻음
     */
    get data(): IProduct {
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
    static async fetchAll(): Promise<readonly IProduct[]> {
        return await this.getProducts();
    }

    static async findById(id: string | number) {
        const data = await db.product.findFirst({ where: { id: Number(id) } });
        return data ? new ProductEntity(data) : null;
    }

    static async findManyByUid(id: string | number) {
        const arr = await db.product.findMany({
            where: {
                uid: Number(id)
            }
        });

        return arr;
    }

    static async deleteById(id: string | number) {
        await db.product.delete({ where: { id: Number(id) } });
    }
}