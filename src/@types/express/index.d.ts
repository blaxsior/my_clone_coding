import { UserEntity as User } from "../../model/user.model.js";
declare namespace Express {
    type User = import('../../model/user.model.js').UserEntity;
    interface Request {
        // session: 
    }
}



// type User = import('../../model/user.model.js').UserEntity
// import 근거
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-9.html#import-types
