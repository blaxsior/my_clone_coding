import { ObjectId } from "mongodb";


export class ConvId {
    static convertId(id: string | ObjectId) {
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