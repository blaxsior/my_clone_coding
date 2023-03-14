import { ObjectId } from 'mongodb';
import { mongodb } from '../db/mongo.index.js';
import { ConvId } from '../util/ConvId.js';

export interface IProduct {
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
        this._id = data._id;
        this.title = data.title;
        this.price = data.price;
        this.description = data.description;
        this.imageUrl = data.imageUrl;
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
        if (this._id) {
            const result = await ProductEntity.collection.updateOne(
                { _id: this._id },
                {
                    $set: {
                        title: this.title,
                        imageUrl: this.imageUrl,
                        price: this.price,
                        description: this.description,
                        uid: this.uid
                    }
                });
        } else {
            const result = await ProductEntity.collection.insertOne({
                title: this.title,
                imageUrl: this.imageUrl,
                price: this.price,
                description: this.description,
                uid: this.uid
            });
            this._id = result.insertedId;
        }
    }

    /**
     * @returns 데이터베이스 내 전체 product
     */
    static async fetchAll() {
        return await this.getProducts();
    }

    static async findById(id: string | ObjectId) {
        const _id = ConvId.convertId(id);
        const data = _id ? await this.collection.findOne({ _id }) : null;
        return data ? new ProductEntity(data) : null;
    }

    /**
     * 유저의 id 기반으로 검색
     * @param id 특정 유저의 id값
     * @returns 
     */
    static async findManyByUid(id: string | ObjectId) {
        const uid = ConvId.convertId(id);
        return uid ? await this.collection.find({ uid: uid }).toArray() : [];
    }

    static async findManyById(id_list?: ObjectId[])
    {
        return await this.collection.find({
            _id: {
                $in: id_list
            }
        }).toArray()
    }

    static async deleteById(id: string | ObjectId) {
        const _id = ConvId.convertId(id);
        _id && await this.collection.deleteOne({ _id });
    }
}