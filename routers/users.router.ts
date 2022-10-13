import express from 'express';

import { serviceContainer } from '../config/inversify.config';

import { DB, DBInterface } from "../types/db.types";
import { User, UserLimit } from "../types/user.types";

import { createUserValidationMiddleware, updateUserValidationMiddleware } from '../validation/users/user-validation.middleware';

import { UsersService } from "../services/users.service";
import { UserDataService } from "../services/user-data.service";
import { routerErrorLog } from "../utils/logger.helpers";
import {UserData} from "../types/user-data.types";

const router = express.Router();

const UserServiceInstance = new UsersService( serviceContainer.get<DBInterface>(DB) );
const UserDataServiceInstance = new UserDataService( serviceContainer.get<DBInterface>(DB) );

router.get('/', async ( req: express.Request, res: express.Response, next ) => {
    try {
        // const { loginSubstringIn = '', limit = UserLimit.DEFAULT} = req.query;
        // @ts-ignore
        const users: User[] | null = await UserServiceInstance.getUsers();
        const USERS_PROMISES = [];
        for (const { id, isDeleted } of users) {
            if (!isDeleted && id) {
                USERS_PROMISES.push(UserDataServiceInstance.getUserDataById(id));
            }
        }
        const usersData: UserData[] | null = await Promise.all(USERS_PROMISES);
        const formattedUsers = users.map( user => {
           const userPayload = usersData.find( ({user_id}) => user_id === user.id);
           return {
               id: user.id,
               username: user.username,
               age: userPayload?.age || null
           }
        });
        if ( formattedUsers )
            return res.status(200).json({ users: formattedUsers });

        return next({
            statusCode: 400,
                message: 'Bad request!'
        });
    }
    catch( error ){
        next( routerErrorLog('GET /users', req.query, error ) );
    }
});

router.get('/:id', async ( req: express.Request, res: express.Response, next ) => {
    try {
        const { id } = req.params;
        const user: User | null = await UserServiceInstance.getUserById(id);
        const userData: UserData | null = await UserDataServiceInstance.getUserDataById(id)

        if( user )
            return res.status(200).json({ user: {
                    username: user.username,
                    age: userData?.age
                }
            })
        return next({
            statusCode: 404,
            message: 'User not found!'
        });
    }
    catch( error ){
        next( routerErrorLog('GET /users/:id', req.params, error ) );
    }
});

router.post('/', createUserValidationMiddleware, async ( req: express.Request, res: express.Response, next ) => {
    try{
        const { username, password, age } = req.body;
        const user = await UserServiceInstance.createUser({ username, password });
        const userData = await UserDataServiceInstance.createUserData({
            user_id: user.id,
            name: 'user',
            permissions: [],
            age
        });

        if( user && userData )
            return res.status(200).json({ user: {
                    id: user.id,
                    username: user.username,
                    age: user.age
                }
            })

        return next({
            statusCode: 400,
            message: 'User is already exists!'
        });
    }
    catch( error ){
        next( routerErrorLog('POST /users', req.body, error ) );
    }
});

router.delete('/:id', async ( req: express.Request, res: express.Response, next ) => {
    try{
        const { id } = req.params;

        const [ removedUser ] = await Promise.all([
            await UserServiceInstance.deleteUser( id )
        ]);

        if( removedUser )
            return res.status(200).json({
                message: 'User successfully removed!'
            })
        return next({
            statusCode: 404,
            message: 'User not found!'
        });
    }
    catch( error ){
        next( routerErrorLog('DELETE /users/:id', req.params, error ) );
    }
});

export default router;