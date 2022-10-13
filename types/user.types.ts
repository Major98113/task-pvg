export interface User {
    id?: string,
    username: string,
    password: string,
    isDeleted?: boolean
}

export enum UserLimit {
    DEFAULT = 20
}

export interface UserServiceInterface {
    getUsers( loginSubstringIn?: string, limit?: number ): Promise<User[] | null>,
    getUserByCredentials( username: string, password: string ): Promise<User[] | null>,
    login( username: string, password: string ): Promise<string | null>,
    getUserById( id: string ): Promise<User | null>,
    createUser( user: User ): Promise<User | undefined>,
    deleteUser( id: string ): Promise<User | undefined>
}