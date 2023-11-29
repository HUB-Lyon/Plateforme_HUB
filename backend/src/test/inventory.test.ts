import chai from 'chai';
import chaiHttp from 'chai-http';
import { app , server , dataBase} from '../app.js';
import { Repository } from 'typeorm';
import { Inventory } from '../entity/inventory.js';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Inventory', () => {

    let repository: Repository<Inventory>;

    beforeAll(async () => {
        await dataBase
            .initialize()
            .catch((err) => {
                console.log('Error connecting to database', err);
            });
        repository = dataBase.getRepository(Inventory);
    });

    afterEach(async () => {
        await repository.query('DELETE from inventory;');
    });

    it('should return all items from the inventory on /inventory GET', async () => {
        await repository.save({
            id: 1,
            name: 'name',
            image: 'image',
            category: 'category',
            quantity: 2,
            available: true,
            description: 'description',
        });
        const res = await chai.request(app).get('/inventory');
        expect(res).to.have.status(200);
        expect(res.text).to.equal('[{"id":1,"name":"name","image":"image","category":"category","quantity":2,"available":true,"description":"description"}]');
    });

    it('should return a specific item from the inventory by ID on /inventory/:id GET', async () => {
        await repository.save({
            id: 2,
            name: 'name',
            image: 'image',
            category: 'category',
            quantity: 2,
            available: true,
            description: 'description',
        });
        const res = await chai.request(app).get('/inventory/2');
        expect(res).to.have.status(200);
        expect(res.text).to.equal('{"id":2,"name":"name","image":"image","category":"category","quantity":2,"available":true,"description":"description"}');
    });

    it('should return items from the inventory by category ID on /inventory/category/:id GET', async () => {
        await repository.save({
            id: 3,
            name: 'name',
            image: 'image',
            category: 'boite',
            quantity: 2,
            available: true,
            description: 'description',
        });
        const res = await chai.request(app).get('/inventory/category/boite');
        expect(res).to.have.status(200);
        expect(res.text).to.equal('[{"id":3,"name":"name","image":"image","category":"boite","quantity":2,"available":true,"description":"description"}]');
    });

    it('should Add a new item to the inventory. on /inventory POST', async () => {
        const new_item = {
            id: 4,
            name: 'name',
            image: 'image',
            category: 'category',
            quantity: 2,
            available: true,
            description: 'description',
        };
        const res = await chai.request(app).post('/inventory').send(new_item);
        expect(res).to.have.status(201);
        const res2 = await chai.request(app).get('/inventory/4');
        expect(res2.text).to.equal('{"id":4,"name":"name","image":"image","category":"category","quantity":2,"available":true,"description":"description"}');
    });

    it('should Delete an item from the inventory by ID on /inventory/:id DELETE', async () => {
        await repository.save({
            id: 5,
            name: 'name',
            image: 'image',
            category: 'category',
            quantity: 2,
            available: true,
            description: 'description',
        });
        const res = await chai.request(app).delete('/inventory/5');
        expect(res).to.have.status(202);
        const res2 = await chai.request(app).get('/inventory/5');
        expect(res2).to.have.status(200);
        expect(res2.text).to.equal('null');
    });

    it('should Update an item in the inventory by ID on /inventory/:id PATCH', async () => {
        await repository.save({
            id: 6,
            name: 'name',
            image: 'image',
            category: 'category',
            quantity: 2,
            available: true,
            description: 'description',
        });
        const new_item = {
            id: 6,
            name: 'New name',
            image: 'New image',
            category: 'category',
            quantity: 2,
            available: true,
            description: 'description',
        };
        const res = await chai.request(app).patch('/inventory/6').send(new_item);
        expect(res).to.have.status(200);
        const res2 = await chai.request(app).get('/inventory/6');
        expect(res2).to.have.status(200);
        expect(res2.text).to.equal('{"id":6,"name":"New name","image":"New image","category":"category","quantity":2,"available":true,"description":"description"}');

    });

    afterAll(() => {
        server.close();
    });

});
