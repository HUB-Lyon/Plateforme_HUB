import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../entity/user.js';
import { Project } from '../entity/projects.js';
import { Inventory } from '../entity/inventory.js';

export default class MainSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<any> {
        const userFactory = factoryManager.get(User);
        const projectsFactory = factoryManager.get(Project);
        const inventoryFactory = factoryManager.get(Inventory);

        await userFactory.saveMany(3);
        await projectsFactory.saveMany(3);
        await inventoryFactory.saveMany(3);
    }
}