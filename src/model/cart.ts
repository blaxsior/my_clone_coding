import { ObjectId } from "mongodb";
import { mongodb } from "../db/mongo.index.js";
import { ConvId } from "../util/ConvId.js";
import { IProduct, ProductEntity } from "./product.js";

interface ICartItem {
    pid: ObjectId;
    quantity: number;
}

interface ICart {
    _id?: ObjectId;
    uid?: ObjectId;
    items?: ICartItem[];
}

export class CartEntity implements ICart {
    private static collection = mongodb.collection<ICart>('carts');
    _id?: ObjectId;
    uid?: ObjectId;
    items: ICartItem[];

    constructor({ _id, uid, items }: ICart) {
        this._id = _id;
        this.uid = uid;
        this.items = items ?? [];
    }

    /**
     * 카트의 정보를 데이터베이스에 반영.  
     * 새로 만들거나, 업데이트 수행.
     */
    async save() {
        if (this._id) {
            await CartEntity.collection.updateOne({
                _id: this._id
            }, {
                $set: {
                    items: this.items,
                    uid: this.uid
                }
            });
        }
        else {
            const result = await CartEntity.collection.insertOne({
                uid: this.uid,
                items: this.items,
            });
            this._id = result.insertedId;
        }
    }

    /**
     * 현재 카트에 제품을 추가(cartitem). 이미 존재하는 경우 qty만큼 더하여 갱신
     * @param pid 제품의 id
     * @param qty 추가할 제품의 양
     */
    async addProduct(pid: string | ObjectId, qty: number) {
        const _pid = ConvId.convertId(pid);
        const pidx = this.items.findIndex(it => it.pid?.equals(pid));
        if (pidx > -1) {
            this.items[pidx].quantity += qty;
        } else {
            this.items.push({ pid: _pid!, quantity: qty });
        }

        await CartEntity.collection.updateOne({ _id: this._id }, {
            $set: {
                items: this.items
            }
        });
    }

    /**
     * 현재 카트에서 제품을 제거
     * @param pid 제품 id
     * @param qty 제품의 양
     */
    async deleteProduct(pid: ObjectId, qty: number) {
        if (!this._id) {
            return;
        }
        const pidx = this.items?.findIndex(it => it.pid?.equals(pid));

        // pidx === 0인 경우도 따져봐야함...
        if (pidx !== undefined && pidx !== null && pidx > -1) {
            this.items!.splice(pidx, 1);
            await CartEntity.collection.updateOne({ _id: this._id }, {
                $set: {
                    items: this.items
                }
            });
        }

    }

    /**
     * 현재 카트에서 제품 목록을 제거
     * @param pid 제품 id
     * @param qty 제품의 양
     */
    async deleteProducts(pid_list?: number[]) {
        this.items.find
        await CartEntity.collection.updateOne({ _id: this._id }, {
            $set: {
                items: []
            }
        });
    }

    //     /**
    //      * 현재 장바구니에 담긴 카트 아이템 리스트 반환.  
    //      * product 자체는 포함되지 않음.
    //      * @returns cartitem[]
    //      */
    //     async getCartItems() {
    //         return await db.cartItem.findMany({
    //             where: {
    //                 cid: this.id
    //             },
    //             select: {
    //                 pid: true,
    //                 quantity: true
    //             }
    //         });
    //     }

    /**
     * 장바구니 반환
     * @param uid 유저의 id 값
     * @returns CartEntity {}
     */
    static async findByUid(uid: string | ObjectId) {
        const id = ConvId.convertId(uid);
        const cart = id ? await CartEntity.collection.findOne({ uid: id }) : null;
        return cart ? new CartEntity(cart) : null;
    }

    async getCartData() {
        const products = await ProductEntity.findManyById(this.items.map(it=> it.pid))
        return {
            totalPrice: 0,
            items: products.map((p) => ({
                product: p,
                quantity: this.items.find(it => it.pid.equals(p._id))?.quantity
            }))
        }
        // return id ? await CartEntity.collection.aggregate([
        //     {
                // '$lookup': {
                //     'from': 'products',
                //     'localField': 'items.pid',
                //     'foreignField': '_id',
                //     'as': 'items.product'
                // }
        //     }]) : null;
    }

    //     /**
    //      * 장바구니 페이지에 보여줄 데이터 반환  
    //      * (/views/shop/cart.ejs 참고)
    //      * @param uid 유저의 id 값
    //      * @returns cart { items [ product ] }   
    //      */
    //     static async getCartDataByUid(uid: string | number) {
    //         const cart = await db.cart.findFirst({
    //             where: {
    //                 uid: Number(uid)
    //             },
    //             include: {
    //                 items: {
    //                     include: {
    //                         product: true
    //                     }
    //                 }
    //             }
    //         });
    //         return cart ?? await db.cart.create({
    //             data: {
    //                 uid: Number(uid)
    //             },
    //             include: {
    //                 items: {
    //                     include: {
    //                         product: true
    //                     }
    //                 }
    //             }
    //         });
    //     }
}