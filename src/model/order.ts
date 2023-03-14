import { db } from "../db/index.js";
import { ObjectId } from "mongodb";
import { mongodb } from "../db/mongo.index.js";
import { IProduct, ProductEntity } from "./product.js";


interface IOrderItem {
    product: IProduct
    quantity: number;
}

interface IOrder {
    _id?: ObjectId;
    uid?: ObjectId;
    items?: IOrderItem[];
}


export class OrderEntity implements IOrder {
    private static collection = mongodb.collection<IOrder>('orders');
    _id?: ObjectId;
    uid?: ObjectId;
    items: IOrderItem[];

    constructor({ _id, uid, items }: IOrder) {
        this._id = _id;
        this.uid = uid;
        this.items = items ?? [];
    }

    /**
     * 주문과 제품을 따로 생성할때 사용하는 함수. (차후 추가 등의 상황)
     * 현재 주문이 존재하지 않는 경우 사용할 수 없음.
     * @param items 
     */
    async addProducts(items: IOrderItem[]) {
        if (this._id) {
            await OrderEntity.collection.updateOne({
                _id: this._id
            }, {
                $set: {
                    items: items
                }
            });
        }
    }

    /**
     * 주문과 제품을 함께 생성할 때 사용하는 함수.
     * this.addProducts와는 구분됨.
     * @param items 아이템 목록
     */
    async save() {
        if (this._id) {
            await OrderEntity.collection.updateOne({
                _id: this._id
            }, {
                $set: {
                    items: this.items,
                    uid: this.uid
                }
            });
        }
        else {
            const result = await OrderEntity.collection.insertOne({
                uid: this.uid,
                items: this.items,
            });
            this._id = result.insertedId;
        }
    }

    /**
     * @param   선택할 열
     * @returns 현재 주문에 담긴 아이템 반환.
     */
    async getOrderItems() {
        return this.items;
    }

    /**
     * 사용자의 id 값을 기반으로 주문 목록을 모두 가져오되, orderitem 및 product 데이터를 함께 가져온다.
     * @param  uid  사용자의 id 값
     * @param limit 제한할 값
     */
    static async getOrdersByUid(data: {uid: ObjectId, offset?: number, limit?: number})
    {
        const orders = await OrderEntity.collection.find({
            uid: data.uid
        },
        {
            skip: data.offset,
            limit: data.limit
        }).toArray();

        return orders;
    }
}


// 사실 ORM을 이용하는 시점에서 model 코드를 따로 작성하는 것이 효율적인지는 모르겠음.
// Cart - CartItem과 같은 경우에는 코드를 작성하는 편이 더 편리하긴 한데, 복잡하게 들어가면?
