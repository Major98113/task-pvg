type Permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

export interface UserData {
    id: string,
    name: string,
    permissions: Array<Permission>
}

export interface UserDataServiceInterface {
    getUserDataById( id: string ): Promise<UserData | null>,
    getAllUserData(): Promise<UserData[] | null>,
    createUserData( userData:  UserData ): Promise<UserData | null>,
    updateUserData( userData:  UserData ): Promise<UserData | null>,
    removeUserData( id: string ): Promise<Error | null>
}