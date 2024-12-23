import { Express } from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const db = (app: Express, dbDir:string) => {
    const read = (path: string) => {
        try {
            const data = readFileSync(join(dbDir, path), 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading file:', error);
            return {};
        }
    };
    const write = (path: string, data: object) => {
        try {
            writeFileSync(join(dbDir, path), JSON.stringify(data, null, 4), 'utf-8');
        } catch (error) {
            console.error('Error writing file:', error);
        }
    };

    const createDatabase = (name: string) => {};
    const dropDatabase = (name: string) => {};
    const showDatabase = (name: string) => {};
    const createCollection = (name: string) => {};
    const dropCollection = (name: string) => {};
    const showCollection = (name: string) => {};

    const insertOne = (document: Object) => {};
    const insertMany = (documents: Object[]) => {};
    const updateOne = (id: string, document: Object) => {};
    const updateMany = (ids: string[], documents: Object[]) => {};
    const deleteOne = (id: string) => {};
    const deleteMany = (ids: string) => {};
    const find = (query: Object, option: Object) => {};
    const findOne = (query: Object, option: Object) => {};
    const count = (query: Object, option: Object) => {};
}

export default db;