import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Inventory } from '../entity/inventory.js';
import { Project } from '../entity/projects.js';
import { User } from '../entity/user.js';

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT } = process.env;

export const dataBase: DataSource = new DataSource({
    type: 'postgres',
    host: PGHOST!,
    port: parseInt(PGPORT!, 10),
    username: PGUSER!,
    password: PGPASSWORD!,
    database: PGDATABASE!,
    entities: [Inventory, Project, User],
    logging: true,
    synchronize: true,
    ssl: true
});