import { setSeederFactory } from 'typeorm-extension';
import { Inventory } from '../entity/inventory.js';
import { Faker } from '@faker-js/faker';

export const InventoryFactory = setSeederFactory (Inventory, (faker: Faker) => {
    const inventory = new Inventory();
    inventory.name = faker.string.sample();
    inventory.image = faker.image.url();
    inventory.category = faker.string.sample();
    inventory.quantity = faker.number.int();
    inventory.available = faker.datatype.boolean();
    inventory.description = faker.string.sample();
    return inventory;
});