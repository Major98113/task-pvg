import express from 'express';

import { serviceContainer } from '../config/inversify.config';

import { DB, DBInterface } from "../types/db.types";
import { User, UserLimit } from "../types/user.types";

import { createUserValidationMiddleware, updateUserValidationMiddleware } from '../validation/users/user-validation.middleware';

import { UsersService } from "../services/users.service";
import { routerErrorLog } from "../utils/logger.helpers";

const router = express.Router();

const UserServiceInstance = new UsersService( serviceContainer.get<DBInterface>(DB) );

router.get('/', async ( req: express.Request, res: express.Response, next ) => {
    try {
        const { loginSubstringIn = '', limit = UserLimit.DEFAULT} = req.query;
        // @ts-ignore
        const users: User[] | null = await UserServiceInstance.getUsersByLoginSubstr( loginSubstringIn, limit );

        if ( users )
            return res.status(200).json({ users });

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

        if( user )
            return res.status(200).json({ user: {
                    username: user.username,
                    age: user.age
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
        const user = await UserServiceInstance.createUser({ username, password, age });

        if( user )
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

router.put('/:id', updateUserValidationMiddleware, async ( req: express.Request, res: express.Response, next ) => {
    const { id } = req.params;
    try{
        const updatedUser = await UserServiceInstance.updateUser({ id, ...req.body });

        if( updatedUser )
            return res.status(200).json({ user: {
                    id: updatedUser.id,
                    login: updatedUser.login,
                    age: updatedUser.age
                }
            });

        return next({
            statusCode: 404,
            message: 'User not found!'
        });
    }
    catch( error ){
        next( routerErrorLog('PUT /users/:id', { ...req.params, ...req.body }, error ) );
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