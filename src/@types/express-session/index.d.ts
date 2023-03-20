import { UserEntity as User } from "../../model/user.model.js";
// type User = import('../../model/user.model.js').UserEntity;

declare module 'express-session' {
    interface SessionData {
        user?: User;
    }
}