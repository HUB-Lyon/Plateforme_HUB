import chai from 'chai';
import chaiHttp from 'chai-http';
import { app, server, dataBase } from '../app.js';
import { Repository } from 'typeorm';
import { Project } from '../entity/projects.js';
import { Inventory } from '../entity/inventory.js';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Project', () => {

    let repository: Repository<Project>;
    let repository2: Repository<Inventory>;

    beforeAll(async () => {
        await dataBase
            .initialize()
            .catch((err) => {
                console.log('Error connecting to database', err);
            });
        repository = dataBase.getRepository(Project);
        repository2 = dataBase.getRepository(Inventory);
    });

    afterEach(async () => {
        await repository.query('DELETE from project;');
    });

    it('should return all Projects on /projects GET', async () => {
        const data = {
            name: 'name',
            description: 'description',
            image: 'image',
            createdAt: '2023-11-29T13:45:27.130Z',
            leaderId: 2,
            membersIds: [2, 3],
            status: 'test',
        };
        const value = await repository.save(data);
        const data2 = {
            name: 'name',
            description: 'description',
            image: 'image',
            createdAt: '2023-11-29T13:45:27.130Z',
            leaderId: 2,
            membersIds: [2, 3],
            status: 'test',
        };
        const value2 = await repository.save(data2);

        const res = await chai.request(app).get('/projects');
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array').that.is.not.empty;

        expect(res.body[0].id).to.equal(Number(value.id));
        expect(res.body[0].name).to.equal(data.name);
        expect(res.body[0].description).to.equal(data.description);
        expect(res.body[0].image).to.equal(data.image);
        expect(res.body[0].createdAt).to.equal('2023-11-29T13:45:27.130Z');
        expect(res.body[0].leaderId).to.equal(data.leaderId);
        expect(res.body[0].membersIds).to.deep.equal(data.membersIds);
        expect(res.body[0].status).to.equal(data.status);
        expect(res.body[1].id).to.equal(Number(value2.id));
        expect(res.body[1].name).to.equal(data.name);
        expect(res.body[1].description).to.equal(data.description);
        expect(res.body[1].image).to.equal(data.image);
        expect(res.body[1].createdAt).to.equal('2023-11-29T13:45:27.130Z');
        expect(res.body[1].leaderId).to.equal(data.leaderId);
        expect(res.body[1].membersIds).to.deep.equal(data.membersIds);
        expect(res.body[1].status).to.equal(data.status);
    });

    it('should return a specific project by ID on /projects/:id GET', async () => {
        const data = {
            name: 'name',
            description: 'description',
            image: 'image',
            createdAt: '2023-11-29T13:45:27.130Z',
            leaderId: 2,
            membersIds: [2, 3],
            status: 'test',
        };
        const value = await repository.save(data);

        const res = await chai.request(app).get(`/projects/${value.id}`);
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.be.an('object');

        expect(res.body.id).to.equal(Number(value.id));
        expect(res.body.name).to.equal(data.name);
        expect(res.body.description).to.equal(data.description);
        expect(res.body.image).to.equal(data.image);
        expect(res.body.createdAt).to.equal('2023-11-29T13:45:27.130Z');
        expect(res.body.leaderId).to.equal(data.leaderId);
        expect(res.body.membersIds).to.deep.equal(data.membersIds);
        expect(res.body.status).to.equal(data.status);
    });

    it('should return projects by status ID on /projects/status/:id GET', async () => {
        const data = {
            name: 'name',
            description: 'description',
            image: 'image',
            createdAt: '2023-11-29T13:45:27.130Z',
            leaderId: 2,
            membersIds: [2, 3],
            status: 'test',
        };
        const value = await repository.save(data);

        const res = await chai.request(app).get('/projects/status/test');
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.be.an('array').that.is.not.empty;

        expect(res.body[0].id).to.equal(Number(value.id));
        expect(res.body[0].name).to.equal(data.name);
        expect(res.body[0].description).to.equal(data.description);
        expect(res.body[0].image).to.equal(data.image);
        expect(res.body[0].createdAt).to.equal('2023-11-29T13:45:27.130Z');
        expect(res.body[0].leaderId).to.equal(data.leaderId);
        expect(res.body[0].membersIds).to.deep.equal(data.membersIds);
        expect(res.body[0].status).to.equal(data.status);
    });

    it('should Create a new project on /projects POST', async () => {
        const newProject = {
            name: 'name',
            description: 'description',
            image: 'image',
            elementsIds: [1, 2, 3],
            createdAt: '2023-11-29T13:45:27.130Z',
            leaderId: 2,
            membersIds: [2, 3],
            status: 'test',
        };
        const InvElement1 = {
            name: 'name',
            image: 'image',
            category: 'category',
            quantity: 6,
            available: 6,
            description: 'description',
        };
        const InvElement2 = {
            name: 'name',
            image: 'image',
            category: 'category',
            quantity: 2,
            available: 6,
            description: 'description',
        };
        const InvElement3 = {
            name: 'name',
            image: 'image',
            category: 'category',
            quantity: 18,
            available: 20,
            description: 'description',
        };

        await repository2.save(InvElement1);
        await repository2.save(InvElement2);
        await repository2.save(InvElement3);
        const res = await chai.request(app).post('/projects').send(newProject);
        expect(res).to.have.status(201);

        const res2 = await chai.request(app).get(`/projects/${res.body.identifiers[0].id}`);
        expect(res2).to.have.status(200);

        expect(res2.body.id).to.equal(Number(res.body.identifiers[0].id));
        expect(res2.body.name).to.equal(newProject.name);
        expect(res2.body.description).to.equal(newProject.description);
        expect(res2.body.image).to.equal(newProject.image);
        expect(res2.body.createdAt).to.equal(newProject.createdAt);
        expect(res2.body.leaderId).to.equal(newProject.leaderId);
        expect(res2.body.membersIds).to.deep.equal(newProject.membersIds);
        expect(res2.body.status).to.equal(newProject.status);

        const resInv1 = await chai.request(app).get('/inventory/1');
        const resInv2 = await chai.request(app).get('/inventory/2');
        const resInv3 = await chai.request(app).get('/inventory/3');

        expect(resInv1.body.quantity).to.equal(5);
        expect(resInv2.body.quantity).to.equal(1);
        expect(resInv3.body.quantity).to.equal(17);
    });

    it('should Delete a project by ID on /projects/:id DELETE', async () => {
        const data = {
            name: 'name',
            description: 'description',
            image: 'image',
            createdAt: '2023-11-29T13:45:27.130Z',
            leaderId: 2,
            membersIds: [2, 3],
            status: 'test',
        };
        const value = await repository.save(data);

        const res = await chai.request(app).delete(`/projects/${value.id}`);
        expect(res).to.have.status(202);

        const res2 = await chai.request(app).get(`/projects/${value.id}`);
        expect(res2).to.have.status(200);
        expect(res2.body).to.equal(null);
    });

    it('should Update a project by ID on /projects/:id PATCH', async () => {
        const data = {
            name: 'name',
            description: 'description',
            image: 'image',
            createdAt: '2023-11-29T13:45:27.130Z',
            leaderId: 2,
            membersIds: [2, 3],
            status: 'test',
        };
        const value = await repository.save(data);

        const newProject = {
            name: 'new name',
            description: 'new description',
            image: 'image',
            createdAt: '2023-11-29T13:45:27.130Z',
            leaderId: 2,
            membersIds: [2, 3],
            status: 'test',
        };

        const res = await chai.request(app).patch(`/projects/${value.id}`).send(newProject);
        expect(res).to.have.status(200);

        const res2 = await chai.request(app).get(`/projects/${value.id}`);
        expect(res2).to.have.status(200);

        expect(res2.body.id).to.equal(Number(value.id));
        expect(res2.body.name).to.equal(newProject.name);
        expect(res2.body.description).to.equal(newProject.description);
        expect(res2.body.image).to.equal(newProject.image);
        expect(res2.body.createdAt).to.equal(newProject.createdAt);
        expect(res2.body.leaderId).to.equal(newProject.leaderId);
        expect(res2.body.membersIds).to.deep.equal(newProject.membersIds);
        expect(res2.body.status).to.equal(newProject.status);
    });

    afterAll(() => {
        server.close();
    });

});
