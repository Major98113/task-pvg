import { Container } from 'inversify';
import { beforeAll } from '@jest/globals';
const faker = require('faker');

import { DBInterface, DB } from '../types/db.types';
import { UserData, UserDataServiceInterface } from '../types/user-data.types';
import { PostgresqlTest } from '../loaders/postgresql-test';
import { UserDataService } from './user-data.service';

const testUserData: UserData = {
    user_id: faker.random.uuid(),
    name: faker.internet.userName(),
    permissions: [ "READ", "WRITE" ],
    age: 42
};

const updatedTestUserData: UserData = {
    user_id: testUserData.user_id,
    name: testUserData.name,
    permissions: [ "SHARE", "WRITE" ],
    age: 41
};

const serviceContainer = new Container();
let UserDataServiceInstance: UserDataServiceInterface;

beforeAll(() => {
    serviceContainer.bind<DBInterface>(DB).to(PostgresqlTest);
    UserDataServiceInstance = new UserDataService( serviceContainer.get<DBInterface>(DB) );
});

describe('UserDataService', () => {
    describe('getAllUserData', () => {
        it('Check that we have array of users with next params: id, login, age in default case', async () => {
            const userData: UserData[] | null = await UserDataServiceInstance.getAllUserData();

            expect( Array.isArray( userData ) ).toEqual(true);
            expect(
                userData && userData.every(
                ( item: UserData ) =>
                    typeof item.user_id === 'string' &&
                    typeof item.name === 'string' &&
                    typeof item.permissions === 'object'
                )
            ).toEqual(true);

        });
    });

    describe('createUserData', () => {
        it('Check that we have not desired user before creating', async () => {
            const userData: UserData[] | null = await UserDataServiceInstance.getAllUserData();
            expect( userData?.find( userData => userData.name === testUserData.name )).toBeFalsy();
        });

        it('Check correct creating of user data', async () => {
            const createUserData: UserData | null = await UserDataServiceInstance.createUserData( testUserData );
            expect( createUserData ).toBeTruthy();
        });

        it('Check that we have desired user after creating', async () => {
            const userData: UserData[] | null = await UserDataServiceInstance.getAllUserData();
            expect( userData?.find( userData => userData.name === testUserData.name )).toBeTruthy();
        });
    });

    describe('updateUserData', () => {
        it('Check that we have not desired user data info before updating', async () => {
            const userData: UserData | null = await UserDataServiceInstance.getUserDataById( testUserData.user_id );
            expect( userData?.name ).toBeTruthy();
        });

        it('Check that we have desired user data info after updating', async () => {
            const userData: UserData[] | null = await UserDataServiceInstance.getAllUserData();
            expect( userData?.find( userData =>
                userData.user_id === updatedTestUserData.user_id &&
                ( JSON.stringify(userData.permissions) === JSON.stringify(updatedTestUserData.permissions) )
            )).toBeTruthy();
        });

        it('Check right removing of user data', async () => {
            const searchedUserData: UserData | null = await UserDataServiceInstance.getUserDataById(testUserData.user_id);

            if ( searchedUserData )
                await UserDataServiceInstance.removeUserData( searchedUserData.user_id );

            const removedUserData = await UserDataServiceInstance.getUserDataById( testUserData.user_id );

            expect( removedUserData ).toBeFalsy();
        });
    })
});
