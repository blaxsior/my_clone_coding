import { ObjectId } from "mongodb";
import { mongodb } from "../db/mongo.index.js";

interface IUser {
    _id?: ObjectId;
    name?: string;
    email?: string;
}
export class UserEntity implements IUser {
    private static collection = mongodb.collection<IUser>('users');
    _id?: ObjectId;
    name?: string;
    email?: string;

    constructor(data: IUser) {
        this._id = data._id;
        this.name = data.name;
        this.email = data.email;
    }

    public async save() {
        const result = await UserEntity.collection.insertOne({
            email: this.email,
            name: this.name
        });
        this._id = result.insertedId;
    }

    static async findById(id: string) {
        let _id: ObjectId;
        let data; 
        try { // id 값이 12bytes string 또는 24 hex integer이 아니면 오류 발생.
            _id = new ObjectId(id);
            data = await this.collection.findOne({ _id });
        }
        catch {
            data = null;
        }
        return data ? new UserEntity(data) : null;
    }

    static async findByUserInfo(info: IUser) {
        const data = await this.collection.findOne({ name: info.name, email: info.email })
        return data ? new UserEntity(data) : null;
    }

    static async deleteById(id: string) {
        await this.collection.deleteOne({ _id: new ObjectId(id) });
    }
}