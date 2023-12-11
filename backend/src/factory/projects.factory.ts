import { setSeederFactory } from 'typeorm-extension';
import { Project } from '../entity/projects.js';
import { Faker } from '@faker-js/faker';

export const ProjectsFactory = setSeederFactory (Project, (faker: Faker) => {
    const project = new Project();
    project.name = faker.string.sample();
    project.description = faker.string.sample();
    project.image = faker.image.url();
    project.leaderId = faker.number.int();
    project.status = faker.string.sample();
    return project;
});