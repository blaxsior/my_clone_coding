declare namespace Express {
    type User = import('../../model/user.js').UserEntity
    interface Request {
        user?: User
        // user?: User
    }
}
// import 근거
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-9.html#import-types
