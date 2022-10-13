import { User } from "../types/user.types";

export const sortingByLoginASC = ( users: User[] | null ) => {
    // @ts-ignore
    return [...users].sort( ( { username: login1 } : string, { username: login2 } : string ) => {
        let fa = login1.toLowerCase(),
            fb = login2.toLowerCase();

        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    });
}