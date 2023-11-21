import dotenv from 'dotenv';
import { DataSource, In } from 'typeorm';
import { Inventory } from '../entity/inventory.js';

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT, ENDPOINT_ID, } = process.env;

export const myDataSource: DataSource = new DataSource({
    type: 'postgres',
    host: PGHOST!,
    port: parseInt(PGPORT!, 10),
    username: PGUSER!,
    password: PGPASSWORD!,
    database: PGDATABASE!,
    entities: [Inventory],
    logging: true,
    synchronize: true,
    ssl: true
});
