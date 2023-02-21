import { ObjectId } from 'mongodb';
import { mongodb } from '../db/mongo.index.js';

interface IProduct {
    _id?: ObjectId;
    title?: string;
    price?: number;
    description?: string | null;
    imageUrl?: string | null;
    uid?: ObjectId;
}
export class ProductEntity implements IProduct {
    private static collection = mongodb.collection<IProduct>('products');
    _id?: ObjectId;
    title?: string;
    price?: number;
    description?: string | null;
    imageUrl?: string | null;
    uid?: ObjectId;

    constructor(data: IProduct) {
        this.setData(data);
    }

    setData(data: IProduct) {
        this._id = data._id;
        this.title = data.title;
        this.imageUrl = data.imageUrl;
        const _price = Number(data.price);
        this.price = isNaN(_price) ? 0 : _price;
        this.description = data.description;
        this.uid = data.uid;
    }

    /**
     * @returns Product에 대한 JSON을 반환(원 타입 아님)
     */
    private static async getProducts() {
        return await this.collection.find().toArray();
    }
    /**
     * 현재 product 인스턴스를 저장.  
     * 기존에 존재하면 값을 덮어쓰고, 존재하지 않으면 새로 넣음
     */
    async save() {
        const result = await ProductEntity.collection.insertOne({
            title: this.title,
            imageUrl: this.imageUrl,
            price: this.price,
            description: this.description,
            uid: this.uid
        });
        this._id = result.insertedId;
    }

    /**
     * @returns 데이터베이스 내 전체 product
     */
    static async fetchAll() {
        return await this.getProducts();
    }

    static async findById(id: string | ObjectId) {
        const _id = this.convertId(id);
        const data = _id ? await this.collection.findOne({ _id }) : null;
        return data ? new ProductEntity(data) : null;
    }

    static async findManyByUid(id: string | ObjectId) {
        const uid = this.convertId(id);
        return uid ? await this.collection.find({ uid: uid }).toArray() : [];
    }
    static async deleteById(id: string | ObjectId) {
        const _id = this.convertId(id);
        _id && await this.collection.deleteOne({ _id });
    }

    private static convertId(id: string | ObjectId) {
        if (typeof id === 'string') {
            try { // id 값이 12bytes string 또는 24 hex integer이 아니면 오류 발생.
                return new ObjectId(id);
            }
            catch {
                return null;
            }
        } else {
            return id;
        }
    }
}