export interface DBInterface {
    connect: any,
    client: any
}

export const DB = Symbol.for('DB');