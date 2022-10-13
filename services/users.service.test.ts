import { Container } from 'inversify';
import { beforeAll } from '@jest/globals';
const faker = require('faker');

import { DBInterface, DB } from '../types/db.types';
import {User, UserServiceInterface} from '../types/user.types';
import { PostgresqlTest } from '../loaders/postgresql-test';
import { UsersService } from './users.service';
import { users } from '../config/dump.json';

const testingUser = users[2];

const testUser = {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    age: faker.random.number()
};

const updatedTestUser = {
    age: faker.random.number()
};

const LIMIT = 2;
const serviceContainer = new Container();
let UserServiceInstance: UserServiceInterface;

beforeAll(() => {
    serviceContainer.bind<DBInterface>(DB).to(PostgresqlTest);
    UserServiceInstance = new UsersService( serviceContainer.get<DBInterface>(DB) );
});

describe('UsersService', () => {
    describe('getUsers', () => {
        it('Check that we have array of users with next params: id, login, age in default case', async () => {
            const users: User[] | null = await UserServiceInstance.getUsers();

            expect( Array.isArray( users ) ).toEqual(true);
            expect(
                users && users.every(
                ( item: User ) =>
                    typeof item.id === 'string' &&
                    typeof item.age === 'number' &&
                    typeof item.username === 'string'
                )
            ).toEqual(true);

        });

        it('Check that we have array of users less or equal of limit param', async () => {
            // @ts-ignore
            expect( (await UserServiceInstance.getUsers('', LIMIT ))?.length <= LIMIT).toEqual(true);
        });

        it('Check that searching by substring works correctly', async () => {
            const desiredUsers: User[] |  null = await UserServiceInstance.getUsers(testingUser.username);
            expect(desiredUsers?.length && desiredUsers[0].id).toEqual(testingUser.id);
        });
    });

    describe('getUserById', () => {
        it('Check that method returns to us one user with login, age and id params',  async () => {
            const user: User |  null = await UserServiceInstance.getUserById(testingUser.id);
            expect(
                user?.id &&
                user?.username &&
                user?.age
            ).toBeTruthy();
        });

        it('Check that we have null when try to call imagine id', async () => {
            const user: User |  null = await UserServiceInstance.getUserById('test');
            expect( user ).toEqual( null );
        });
    });

    describe('createUser', () => {
       it('Check that we have not desired user before creating', async () => {
           const noExistedUser: User[] |  null = await UserServiceInstance.getUserByCredentials( testUser.username, testUser.password );
           expect( noExistedUser?.length ).toBeFalsy();
       });

       it('Check right creating of user', async () => {
           const createdUser: User | undefined = await UserServiceInstance.createUser( testUser );
           expect( createdUser ).toBeTruthy();
       });

       it('Check searching of existed user', async () => {
           const searchedUser: User[] | null = await UserServiceInstance.getUserByCredentials( testUser.username, testUser.password );
           expect( searchedUser ).toBeTruthy();
       })
    });

    describe('updateUser', () => {
        it('Check that we have not updated info before update', async () => {
            const searchedUser: User[] | null = await UserServiceInstance.getUserByCredentials( testingUser.username, testingUser.password );
            expect( searchedUser?.length ).toBeTruthy();
        });

        it('Check right updating of user', async () => {
            const updatedUser: User | undefined = await UserServiceInstance.updateUser( { ...testingUser , age: updatedTestUser.age } );
            expect( updatedUser ).toBeTruthy();
        });

        it('Check searching of updated user', async () => {
            const searchedUser: User[] | null = await UserServiceInstance.getUserByCredentials( testingUser.username, testingUser.password );
            expect( searchedUser?.length ).toBeTruthy();
            expect( searchedUser?.[0].age ).toEqual( updatedTestUser.age );
        })
    });

    describe('removeUser', () => {
        it('Check that we have not removed info before deleting', async () => {
            const searchedUser: User[] | null = await UserServiceInstance.getUserByCredentials( testUser.username, testUser.password );
            expect( searchedUser?.length ).toBeTruthy();
        });

        it('Check right removing of user', async () => {
            const searchedUser: User[] | null = await UserServiceInstance.getUserByCredentials( testUser.username, testUser.password );

            if ( searchedUser )
                await UserServiceInstance.deleteUser( searchedUser?.[0].id || '' );

            const removedUser = await UserServiceInstance.getUserByCredentials( testUser.username, testUser.password );

            expect( removedUser?.length ).toBeFalsy();
        });
    });
});
