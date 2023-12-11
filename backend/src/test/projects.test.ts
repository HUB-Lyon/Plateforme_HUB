import chai from 'chai';
import chaiHttp from 'chai-http';
import { app, server, dataBase } from '../app.js';
import { Repository } from 'typeorm';
import { Project } from '../entity/projects.js';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Project', () => {

    let repository: Repository<Project>;

    beforeAll(async () => {
        await dataBase
            .initialize()
            .catch((err) => {
                console.log('Error connecting to database', err);
            });
        repository = dataBase.getRepository(Project);
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
            membersId: [2, 3],
            status: 'test',
        };
        const value = await repository.save(data);
        const data2 = {
            name: 'name',
            description: 'description',
            image: 'image',
            createdAt: '2023-11-29T13:45:27.130Z',
            leaderId: 2,
            membersId: [2, 3],
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
        expect(res.body[0].membersId).to.deep.equal(data.membersId);
        expect(res.body[0].status).to.equal(data.status);
        expect(res.body[1].id).to.equal(Number(value2.id));
        expect(res.body[1].name).to.equal(data.name);
        expect(res.body[1].description).to.equal(data.description);
        expect(res.body[1].image).to.equal(data.image);
        expect(res.body[1].createdAt).to.equal('2023-11-29T13:45:27.130Z');
        expect(res.body[1].leaderId).to.equal(data.leaderId);
        expect(res.body[1].membersId).to.deep.equal(data.membersId);
        expect(res.body[1].status).to.equal(data.status);
    });

    it('should return a specific project by ID on /projects/:id GET', async () => {
        const data = {
            name: 'name',
            description: 'description',
            image: 'image',
            createdAt: '2023-11-29T13:45:27.130Z',
            leaderId: 2,
            membersId: [2, 3],
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
        expect(res.body.membersId).to.deep.equal(data.membersId);
        expect(res.body.status).to.equal(data.status);
    });

    it('should return projects by status ID on /projects/status/:id GET', async () => {
        const data = {
            name: 'name',
            description: 'description',
            image: 'image',
            createdAt: '2023-11-29T13:45:27.130Z',
            leaderId: 2,
            membersId: [2, 3],
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
        expect(res.body[0].membersId).to.deep.equal(data.membersId);
        expect(res.body[0].status).to.equal(data.status);
    });

    it('should Create a new project on /projects POST', async () => {
        const newProject = {
            name: 'name',
            description: 'description',
            image: 'image',
            createdAt: '2023-11-29T13:45:27.130Z',
            leaderId: 2,
            membersId: [2, 3],
            status: 'test',
        };

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
        expect(res2.body.membersId).to.deep.equal(newProject.membersId);
        expect(res2.body.status).to.equal(newProject.status);
    });

    it('should Delete a project by ID on /projects/:id DELETE', async () => {
        const data = {
            name: 'name',
            description: 'description',
            image: 'image',
            createdAt: '2023-11-29T13:45:27.130Z',
            leaderId: 2,
            membersId: [2, 3],
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
            membersId: [2, 3],
            status: 'test',
        };
        const value = await repository.save(data);

        const newProject = {
            name: 'new name',
            description: 'new description',
            image: 'image',
            createdAt: '2023-11-29T13:45:27.130Z',
            leaderId: 2,
            membersId: [2, 3],
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
        expect(res2.body.membersId).to.deep.equal(newProject.membersId);
        expect(res2.body.status).to.equal(newProject.status);
    });

    afterAll(() => {
        server.close();
    });

});
