import { resolve } from "path";
import { readFile, writeFile } from "fs/promises";

export interface CartItem {
    id: string;
    count: number;
}

export interface CartItems {
    items: CartItem[];
    totalPrice: number;
}

export class Cart {
    private static filename = resolve('src', 'db', 'cart.json');

    static async addProduct(id: string, prodPrice: number) {
        let cart: CartItems;

        // 존재하는 제품인지 검사
        try { // 카트 파일이 존재하는 경우
            const str = await readFile(this.filename);
            cart = JSON.parse(str.toString('utf8')) as CartItems;
        }
        catch (e) { // 파일이 존재하지 않는 경우 -> 새로 만들기
            cart = { items: [], totalPrice: 0 };
        }

        const cidx = cart.items.findIndex(item => item.id === id);
        if (cidx > -1) { // 이미 카트에 있음 -> 숫자만 바꿈
            cart.items[cidx].count += 1;
        }
        else { // 카트에 없음 -> 새로 추가
            const newItem: CartItem = { count: 1, id };
            cart.items.push(newItem);
        }
        cart.totalPrice += prodPrice;

        await writeFile(this.filename, JSON.stringify(cart));
    }

    static async deleteProduct(id: string, price: number) {
        const cart = await this.getCart();

        const dElemIdx = cart.items.findIndex(it => it.id === id);

        if (dElemIdx > -1) { // 해당 제품이 존재하는 경우
            // cart.items[dElemIdx].count -= 1;
            const sumCost = cart.items[dElemIdx].count * price;
            cart.items.splice(dElemIdx, 1);
            cart.totalPrice -= sumCost;
            await writeFile(this.filename, JSON.stringify(cart));
        }
    }

    static async getCart() {
        let cart: CartItems;
        try {
            const data = await readFile(this.filename);
            cart = JSON.parse(data.toString('utf8')) as CartItems;
        }
        catch {
            cart = { items: [], totalPrice: 0 }
        }
        return cart;
    }
}