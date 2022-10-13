import { v4 as uuidv4 } from 'uuid';

import { DBInterface } from '../types/db.types';
import { UserData, UserDataServiceInterface } from '../types/user-data.types';
import { USER_DATA_SCHEMA } from '../models/user-data.model';
import { serviceLogger as log } from '../utils/logger.helpers';

class UserDataService implements UserDataServiceInterface{
    private UserData: any;

    constructor(Db: DBInterface) {
        this.UserData = Db.client.define('UserData', USER_DATA_SCHEMA, { timestamps: false });
    }

    @log
    private async isUserDataAlreadyExist( groupId: string | undefined): Promise<boolean> {
        if ( !groupId ) return false;

        return Boolean( await this.getUserDataById( groupId ) );
    }

    @log
    async getUserDataById(id: string) {
        return await this.UserData.findOne({
            where: { id }
        });
    }

    @log
    async getAllUserData() {
        return await this.UserData.findAll();
    }

    @log
    async createUserData( userData:  UserData ) {

        if (await this.isUserDataAlreadyExist(userData.id))
            return;

        return await this.UserData.create({
            id: uuidv4(),
            name: userData.name,
            permissions: userData.permissions
        });
    }

    @log
    async updateUserData( userData:  UserData ){
        const { id } = userData;

        if ( !await this.isUserDataAlreadyExist(userData.id) )
            return;

        const [, [ updatedUserData ] ] = await this.UserData.update( { ...userData }, { returning: true, where: { id } });

        return updatedUserData;
    }

    @log
    async removeUserData( id: string ){
        const desiredUserData = await this.getUserDataById(id);
        if( desiredUserData )
            return await desiredUserData.destroy();

        return;
    }
}

export { UserDataService };
