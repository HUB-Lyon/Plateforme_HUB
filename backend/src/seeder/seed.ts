import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import { User } from '../entity/user.js';
import { Inventory } from '../entity/inventory.js';
import { Project } from '../entity/projects.js';
import { UserFactory } from '../factory/user.factory.js';
import { InventoryFactory } from '../factory/inventory.factory.js';
import { ProjectsFactory } from '../factory/projects.factory.js';
import MainSeeder from './main.seeder.js';

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT } = process.env;

const options: DataSourceOptions & SeederOptions = {
    type: 'postgres',
    host: PGHOST!,
    port: parseInt(PGPORT!, 10),
    username: PGUSER!,
    password: PGPASSWORD!,
    database: PGDATABASE!,
    entities: [Inventory, Project, User],
    logging: true,
    synchronize: true,
    ssl: true,
    factories: [UserFactory, InventoryFactory, ProjectsFactory],
    seeds: [MainSeeder],
};

const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
    await dataSource.synchronize(true);
    await runSeeders(dataSource);
    process.exit();
});
