import * as express from "express";

import { validate } from '../../utils/validate.helpers';
import * as schemas from './user.schema';

export const createUserValidationMiddleware = (req: express.Request, res: express.Response, next: any) => {
    const errors = validate(req.body, schemas.createUserSchema);
    return errors ? next({
        statusCode: 400,
        message: errors.map( (err: any) => err.message ).join(',')
    }): next();
};

export const updateUserValidationMiddleware = (req: express.Request, res: express.Response, next: any) => {
    const errors = validate(req.body, schemas.updateUserSchema);
    return errors ? next({
        statusCode: 400,
        message: errors.map( (err: any) => err.message ).join(',')
    }): next();
};

export const loginUserValidationMiddleware = (req: express.Request, res: express.Response, next: any) => {
    const errors = validate(req.body, schemas.loginUserSchema);
    return errors ? next({
        statusCode: 400,
        message: errors.map( (err: any) => err.message ).join(',')
    }): next();
};