import { User as IUser } from "@prisma/client";
import { db } from "../db/index.js";
import type { Optional } from "../interface/index.js";
export class UserEntity implements IUser {
    id: number;
    name: string;
    email: string;
    password: string;

    constructor({ id, name, email, password }: Optional<IUser, 'id'>) {
        this.id = id ?? -1;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public async save() {
        if (this.id > -1) {
            await db.user.update({
                data: {
                    email: this.email,
                    name: this.name,
                    password: this.password
                },
                where: {
                    id: this.id
                }
            })
        } else {
            const { id } = await db.user.create({
                data: {
                    name: this.name,
                    email: this.email,
                    password: this.password
                }
            });
            this.id = id;
        }
    }

    get data(): IUser {
        return structuredClone(this);
    }
    
    static async findByAuthInfo(email: string, password: string) {
        const data = await db.user.findFirst({
            where: {
                email,
                password
            }
        });
        return data ? new UserEntity(data) : null;
    }

    static async findById(id: string | number) {
        const data = isNaN(Number(id))
            ? null
            : await db.user.findUnique({ where: { id: Number(id) } });

        return data ? new UserEntity(data) : null;
    }

    static async deleteById(id: string | number) {
        await db.user.delete({ where: { id: Number(id) } });
    }
}