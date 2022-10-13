import { injectable } from 'inversify';
import 'reflect-metadata';
import Sequelize from 'sequelize';
import { config } from 'dotenv';
import { DBInterface } from '../types/db.types';

@injectable()
class PostgresDB implements DBInterface{
    public readonly client: any;

    constructor() {
        // @ts-ignore
        const { DB, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD } = config().parsed;
        // @ts-ignore
        this.client = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB}`);
    }

    async connect() {
        try {
            await this.client.authenticate();
            console.log('Connection has been established successfully.');
        }
        catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }
}

export { PostgresDB };