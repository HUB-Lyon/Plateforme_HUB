import chai from 'chai';
import chaiHttp from 'chai-http';
import { app , server , dataBase} from '../app.js';
import { Repository } from 'typeorm';
import { Project } from '../entity/projects.js';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Project', () => {

    let repository: Repository<Project>;

    beforeAll(async () => {
        await dataBase
            .initialize()
            .then(() => {
                console.log('database connected');
            })
            .catch((err) => {
                console.log('Error connecting to database', err);
            });
        repository = dataBase.getRepository(Project);
    });

    afterEach(async () => {
        await repository.query('DELETE from project;');
    });

    it('should return all Projects on /projects GET', async () => {
        await repository.save({
            id: 1,
            name: 'name',
            description: 'description',
            image: 'image',
            created_at: '2023-11-29T13:45:27.130Z',
            leader_id: 2,
            members_id: [2,3],
            status: 'test',
        });
        const res = await chai.request(app).get('/projects');
        expect(res).to.have.status(200);
        expect(res.text).to.equal('[{"id":1,"name":"name","description":"description","image":"image","created_at":"2023-11-29T13:45:27.130Z","leader_id":2,"members_id":[2,3],"status":"test"}]');
    });

    it('should return a specific project by ID on /projects/:id GET', async () => {
        await repository.save({
            id: 2,
            name: 'name',
            description: 'description',
            image: 'image',
            created_at: '2023-11-29T13:45:27.130Z',
            leader_id: 2,
            members_id: [2,3],
            status: 'test',
        });
        const res = await chai.request(app).get('/projects/2');
        expect(res).to.have.status(200);
        expect(res.text).to.equal('{"id":2,"name":"name","description":"description","image":"image","created_at":"2023-11-29T13:45:27.130Z","leader_id":2,"members_id":[2,3],"status":"test"}');
    });

    it('should return projects by status ID on /projects/status/:id GET', async () => {
        await repository.save({
            id: 3,
            name: 'name',
            description: 'description',
            image: 'image',
            created_at: '2023-11-29T13:45:27.130Z',
            leader_id: 2,
            members_id: [2,3],
            status: 'test',
        });
        const res = await chai.request(app).get('/projects/status/test');
        expect(res).to.have.status(200);
        expect(res.text).to.equal('[{"id":3,"name":"name","description":"description","image":"image","created_at":"2023-11-29T13:45:27.130Z","leader_id":2,"members_id":[2,3],"status":"test"}]');
    });

    it('should Create a new project on /projects POST', async () => {
        const new_project = {
            id: 4,
            name: 'name',
            description: 'description',
            image: 'image',
            created_at: '2023-11-29T13:45:27.130Z',
            leader_id: 2,
            members_id: [2,3],
            status: 'test',
        };
        const res = await chai.request(app).post('/projects').send(new_project);
        expect(res).to.have.status(201);
        const res2 = await chai.request(app).get('/projects/4');
        expect(res2.text).to.equal('{"id":4,"name":"name","description":"description","image":"image","created_at":"2023-11-29T13:45:27.130Z","leader_id":2,"members_id":[2,3],"status":"test"}');
    });

    it('should Delete a project by ID on /projects/:id DELETE', async () => {
        await repository.save({
            id: 5,
            name: 'name',
            description: 'description',
            image: 'image',
            created_at: '2023-11-29T13:45:27.130Z',
            leader_id: 2,
            members_id: [2,3],
            status: 'test',
        });
        const res = await chai.request(app).delete('/projects/5');
        expect(res).to.have.status(202);
        const res2 = await chai.request(app).get('/projects/5');
        expect(res2).to.have.status(200);
        expect(res2.text).to.equal('null');
    });

    it('should Update a project by ID on /projects/:id PATCH', async () => {
        await repository.save({
            id: 6,
            name: 'name',
            description: 'description',
            image: 'image',
            created_at: '2023-11-29T13:45:27.130Z',
            leader_id: 2,
            members_id: [2,3],
            status: 'test',
        });
        const new_project = {
            id: 6,
            name: 'new name',
            description: 'new description',
            image: 'image',
            created_at: '2023-11-29T13:45:27.130Z',
            leader_id: 2,
            members_id: [2,3],
            status: 'test',
        };
        const res = await chai.request(app).patch('/projects/6').send(new_project);
        expect(res).to.have.status(200);
        const res2 = await chai.request(app).get('/projects/6');
        expect(res2).to.have.status(200);
        expect(res2.text).to.equal('{"id":6,"name":"new name","description":"new description","image":"image","created_at":"2023-11-29T13:45:27.130Z","leader_id":2,"members_id":[2,3],"status":"test"}');
    });

    afterAll(() => {
        server.close();
    });

});
