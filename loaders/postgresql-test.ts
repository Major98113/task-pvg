import { injectable } from 'inversify';
import 'reflect-metadata';
import Sequelize from 'sequelize';
import { config } from 'dotenv';
import { DBInterface } from '../types/db.types';

@injectable()
class PostgresqlTest implements DBInterface{
    public readonly client: any;

    constructor() {
        // @ts-ignore
        const { TEST_DB, TEST_DB_HOST, TEST_DB_PORT, TEST_DB_USER, TEST_DB_PASSWORD } = config().parsed;
        // @ts-ignore
        this.client = new Sequelize(`postgres://${TEST_DB_USER}:${TEST_DB_PASSWORD}@${TEST_DB_HOST}:${TEST_DB_PORT}/${TEST_DB}`);
    }

    async connect() {
        try {
            await this.client.authenticate();
            console.log('Connection for test DB has been established successfully.');
        }
        catch (error) {
            console.error('Unable to connect to the test database:', error);
        }
    }
}

export { PostgresqlTest };