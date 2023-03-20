import { db } from "../db/index.js";
import type { Order as IOrder, Order, OrderItem as IOrderItem, OrderItem, Prisma, Product } from "@prisma/client";
import { Optional } from "../interface/index.js";

export class OrderEntity implements IOrder {
    id: number;
    uid: number;

    constructor({ id, uid }: Optional<IOrder, 'id'>) {
        this.id = id ?? -1;
        this.uid = Number(uid);
    }

    /**
     * 주문과 제품을 따로 생성할때 사용하는 함수. (차후 추가 등의 상황)
     * 현재 주문이 존재하지 않는 경우 사용할 수 없음.
     * @param items 
     */
    async addProducts(items: Omit<IOrderItem[], 'id'>) {
        if (this.id > -1) {
            await db.orderItem.createMany({
                data: items.map(it => {
                    return {
                        oid: this.id,
                        pid: it.pid,
                        quantity: it.quantity
                    }
                })
            });
        }
    }

    /**
     * 주문과 제품을 함께 생성할 때 사용하는 함수.
     * this.addProducts와는 구분됨.
     * @param items 아이템 목록
     */
    async save(items?: Omit<IOrderItem, 'oid'>[]) {
        const result = items
            ? await db.order.create({
                data: {
                    uid: this.uid,
                    items: {
                        createMany: {
                            data: items.map(it => ({ pid: it.pid, quantity: it.quantity }))
                        }
                    },
                }
            })
            : await db.order.create({
                data: {
                    uid: this.uid
                }
            });

        this.id = result.id;
    }

    /**
     * @param   선택할 열
     * @returns 현재 주문에 담긴 아이템 반환.
     */
    async getOrderItems() {
        return db.orderItem.findMany({
            where: {
                oid: this.id
            }
        })
    }

    /**
     * 사용자의 id 값을 기반으로 주문 목록을 모두 가져오되, orderitem 및 product 데이터를 함께 가져온다.
     * @param  uid  사용자의 id 값
     * @param limit 제한할 값
     */
    static async getOrdersByUid(data: {uid: number, offset?: number, limit?: number})
    {
        const orders = await db.order.findMany({
            where: {
                uid: data.uid
            },
            include: {
                items: {
                    include: {
                        product: true
                    },
                },
            },
            skip: data.offset,
            take: data.limit
        });
        return orders;
    }
}


// 사실 ORM을 이용하는 시점에서 model 코드를 따로 작성하는 것이 효율적인지는 모르겠음.
// Cart - CartItem과 같은 경우에는 코드를 작성하는 편이 더 편리하긴 한데, 복잡하게 들어가면?
