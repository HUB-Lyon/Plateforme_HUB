import dotenv from 'dotenv';
import { newDb, DataType } from 'pg-mem';
import { Inventory } from '../entity/inventory.js';
import { Project } from '../entity/projects.js';
import { User } from '../entity/user.js';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { Article } from '../entity/article.js';

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT, DEBUG } = process.env;

let dataBase: DataSource;

const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: PGHOST!,
    port: parseInt(PGPORT!, 10),
    username: PGUSER!,
    password: PGPASSWORD!,
    database: PGDATABASE!,
    entities: [Inventory, Project, User, Article],
    logging: true,
    synchronize: true,
    ssl: false,
};

if (DEBUG) {
    const db = newDb();
    db.public.registerFunction({
        name: 'current_database',
        args: [],
        returns: DataType.text,
        implementation: () => 'test-database',
    });

    db.public.registerFunction({
        name: 'version',
        args: [],
        returns: DataType.text,
        implementation: () => 'pg-mem',
    });

    dataBase = db.adapters.createTypeormDataSource({
        type: 'postgres',
        entities: [Inventory, Project, User, Article],
        synchronize: true,
    });
} else {
    dataBase = new DataSource(options);
}

export { dataBase, options };