type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

export interface UserData {
    user_id: string,
    name: string,
    permissions: Array<Permission>,
    age: number
}

export interface UserDataServiceInterface {
    getUserDataById( id: string ): Promise<UserData | null>,
    getAllUserData(): Promise<UserData[] | null>,
    createUserData( userData:  UserData ): Promise<UserData | null>,
    removeUserData( id: string ): Promise<Error | null>
}