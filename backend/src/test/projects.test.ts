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
            created_at: '2023-11-29T13:45:27.130Z',
            leader_id: 2,
            members_id: [2, 3],
            status: 'test',
        };
        await repository.save(data);

        const res = await chai.request(app).get('/projects');
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array').that.is.not.empty;

        expect(res.body[0].id).to.equal(1);
        expect(res.body[0].name).to.equal(data.name);
        expect(res.body[0].description).to.equal(data.description);
        expect(res.body[0].image).to.equal(data.image);
        expect(res.body[0].created_at).to.equal('2023-11-29T13:45:27.130Z');
        expect(res.body[0].leader_id).to.equal(data.leader_id);
        expect(res.body[0].members_id).to.deep.equal(data.members_id);
        expect(res.body[0].status).to.equal(data.status);
    });

    it('should return a specific project by ID on /projects/:id GET', async () => {
        const data = {
            name: 'name',
            description: 'description',
            image: 'image',
            created_at: '2023-11-29T13:45:27.130Z',
            leader_id: 2,
            members_id: [2, 3],
            status: 'test',
        };
        await repository.save(data);

        const res = await chai.request(app).get('/projects/2');
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.be.an('object');

        expect(res.body.id).to.equal(2);
        expect(res.body.name).to.equal(data.name);
        expect(res.body.description).to.equal(data.description);
        expect(res.body.image).to.equal(data.image);
        expect(res.body.created_at).to.equal('2023-11-29T13:45:27.130Z');
        expect(res.body.leader_id).to.equal(data.leader_id);
        expect(res.body.members_id).to.deep.equal(data.members_id);
        expect(res.body.status).to.equal(data.status);
    });

    it('should return projects by status ID on /projects/status/:id GET', async () => {
        const data = {
            name: 'name',
            description: 'description',
            image: 'image',
            created_at: '2023-11-29T13:45:27.130Z',
            leader_id: 2,
            members_id: [2, 3],
            status: 'test',
        };
        await repository.save(data);

        const res = await chai.request(app).get('/projects/status/test');
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.be.an('array').that.is.not.empty;

        expect(res.body[0].id).to.equal(3);
        expect(res.body[0].name).to.equal(data.name);
        expect(res.body[0].description).to.equal(data.description);
        expect(res.body[0].image).to.equal(data.image);
        expect(res.body[0].created_at).to.equal('2023-11-29T13:45:27.130Z');
        expect(res.body[0].leader_id).to.equal(data.leader_id);
        expect(res.body[0].members_id).to.deep.equal(data.members_id);
        expect(res.body[0].status).to.equal(data.status);
    });

    it('should Create a new project on /projects POST', async () => {
        const new_project = {
            name: 'name',
            description: 'description',
            image: 'image',
            created_at: '2023-11-29T13:45:27.130Z',
            leader_id: 2,
            members_id: [2, 3],
            status: 'test',
        };

        const res = await chai.request(app).post('/projects').send(new_project);
        expect(res).to.have.status(201);

        const res2 = await chai.request(app).get('/projects/4');
        expect(res2).to.have.status(200);

        expect(res2.body.id).to.equal(4);
        expect(res2.body.name).to.equal(new_project.name);
        expect(res2.body.description).to.equal(new_project.description);
        expect(res2.body.image).to.equal(new_project.image);
        expect(res2.body.created_at).to.equal(new_project.created_at);
        expect(res2.body.leader_id).to.equal(new_project.leader_id);
        expect(res2.body.members_id).to.deep.equal(new_project.members_id);
        expect(res2.body.status).to.equal(new_project.status);
    });

    it('should Delete a project by ID on /projects/:id DELETE', async () => {
        const data = {
            name: 'name',
            description: 'description',
            image: 'image',
            created_at: '2023-11-29T13:45:27.130Z',
            leader_id: 2,
            members_id: [2, 3],
            status: 'test',
        };
        await repository.save(data);

        const res = await chai.request(app).delete('/projects/5');
        expect(res).to.have.status(202);

        const res2 = await chai.request(app).get('/projects/5');
        expect(res2).to.have.status(200);
        expect(res2.body).to.equal(null);
    });

    it('should Update a project by ID on /projects/:id PATCH', async () => {
        const data = {
            name: 'name',
            description: 'description',
            image: 'image',
            created_at: '2023-11-29T13:45:27.130Z',
            leader_id: 2,
            members_id: [2, 3],
            status: 'test',
        };
        await repository.save(data);

        const new_project = {
            name: 'new name',
            description: 'new description',
            image: 'image',
            created_at: '2023-11-29T13:45:27.130Z',
            leader_id: 2,
            members_id: [2, 3],
            status: 'test',
        };

        const res = await chai.request(app).patch('/projects/6').send(new_project);
        expect(res).to.have.status(200);

        const res2 = await chai.request(app).get('/projects/6');
        expect(res2).to.have.status(200);

        expect(res2.body.id).to.equal(6);
        expect(res2.body.name).to.equal(new_project.name);
        expect(res2.body.description).to.equal(new_project.description);
        expect(res2.body.image).to.equal(new_project.image);
        expect(res2.body.created_at).to.equal(new_project.created_at);
        expect(res2.body.leader_id).to.equal(new_project.leader_id);
        expect(res2.body.members_id).to.deep.equal(new_project.members_id);
        expect(res2.body.status).to.equal(new_project.status);
    });

    afterAll(() => {
        server.close();
    });

});
