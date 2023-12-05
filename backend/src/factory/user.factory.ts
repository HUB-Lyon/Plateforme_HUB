import { setSeederFactory } from 'typeorm-extension';
import { User } from '../entity/user.js';
import { Faker } from '@faker-js/faker';

export const UserFactory = setSeederFactory (User, (faker: Faker) => {
    const user = new User();
    user.email = faker.internet.email();
    user.admin = faker.datatype.boolean();
    return user;
});