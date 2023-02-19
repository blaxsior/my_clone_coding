import { db } from "../db/index.js";
import type { Cart as ICart, Prisma } from "@prisma/client";
import { Optional } from "../interface/index.js";

export class CartEntity implements ICart {
    id: number;
    uid: number;

    constructor({ id, uid }: Optional<ICart, 'id'>) {
        this.id = id ?? -1;
        this.uid = Number(uid);
    }

    /**
     * 카트의 정보를 데이터베이스에 반영.  
     * 새로 만들거나, 업데이트 수행.
     */
    async save() {
        if (this.id > -1) {
            await db.cart.update({
                data: {
                    uid: this.uid,
                },
                where: {
                    id: this.id
                }
            });
        } else {
            const result = await db.cart.create({
                data: {
                    uid: this.uid
                }
            });
            this.id = result.id;
        }
    }

    /**
     * 현재 카트에 제품을 추가(cartitem). 이미 존재하는 경우 qty만큼 더하여 갱신
     * @param pid 제품의 id
     * @param qty 추가할 제품의 양
     */
    async addProduct(pid: number, qty: number) {
        if (this.id < 0) { // 카트 없으면 아무 것도 안함
            return;
        }

        const item = await db.cartItem.findFirst({
            where: {
                cid: this.id,
                pid: pid
            }
        });

        if (item) { // 이미 존재하는 경우
            await db.cartItem.update({
                data: {
                    quantity: item.quantity + qty
                },
                where: {
                    cid_pid: {
                        cid: this.id,
                        pid: pid
                    }
                }
            });
        }
        else {
            await db.cartItem.create({
                data: {
                    cid: this.id,
                    pid: pid,
                    quantity: qty
                }
            });
        }
    }

    /**
     * 현재 카트에서 제품을 제거
     * @param pid 제품 id
     * @param qty 제품의 양
     */
    async deleteProduct(pid: number, qty: number) {
        await db.cartItem.delete({
            where: {
                cid_pid: {
                    cid: this.id,
                    pid: pid
                }
            }
        });
    }

    /**
     * 현재 장바구니에 담긴 카트 아이템 리스트 반환.  
     * product 자체는 포함되지 않음.
     * @returns cartitem[]
     */
    async getCartItems() {
        return await db.cartItem.findMany({
            where: {
                cid: this.id
            },
            select: {
                pid: true,
                quantity: true
            }
        });
    }

    /**
     * 장바구니 엔티티 반환(서버 내부 사용)
     * @param uid 유저의 id 값
     * @returns CartEntity {}
     */
    static async getCartEntityByUid(uid: string | number) {
        const cart = await db.cart.findFirst({
            where: { uid: Number(uid) }
        });
        return cart ? new CartEntity(cart) : null;
    }

    /**
     * 장바구니 페이지에 보여줄 데이터 반환  
     * (/views/shop/cart.ejs 참고)
     * @param uid 유저의 id 값
     * @returns cart { items [ product ] }   
     */
    static async getCartDataByUid(uid: string | number) {
        const cart = await db.cart.findFirst({
            where: {
                uid: Number(uid)
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });
        return cart ?? await db.cart.create({
            data: {
                uid: Number(uid)
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });
    }
}