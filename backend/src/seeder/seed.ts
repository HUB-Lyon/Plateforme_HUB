import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { runSeeders } from 'typeorm-extension';
import { UserFactory } from '../factory/user.factory.js';
import { InventoryFactory } from '../factory/inventory.factory.js';
import { ProjectsFactory } from '../factory/projects.factory.js';
import MainSeeder from './main.seeder.js';
import { options } from '../config/db.js';

const newOptions = {
    ...options,
    factories: [UserFactory, InventoryFactory, ProjectsFactory],
    seeds: [MainSeeder]
};

const dataSource = new DataSource(newOptions);

if (process.env.DEBUG) {
    dataSource.initialize().then(async () => {
        await dataSource.synchronize(true);
        await runSeeders(dataSource);
        process.exit();
    });
}
