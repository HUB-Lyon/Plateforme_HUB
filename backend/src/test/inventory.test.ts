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
        const data = {
            name: 'name',
            image: 'image',
            category: 'category',
            quantity: 2,
            available: true,
            description: 'description',
        };
        const value = await repository.save(data);
        const data2 = {
            name: 'name',
            image: 'image',
            category: 'category',
            quantity: 2,
            available: true,
            description: 'description',
        };
        const value2 = await repository.save(data2);

        const res = await chai.request(app).get('/inventory');
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.be.an('array').that.is.not.empty;

        expect(res.body[0].id).to.equal(Number(value.id));
        expect(res.body[0].name).to.equal(data.name);
        expect(res.body[0].image).to.equal(data.image);
        expect(res.body[0].category).to.equal(data.category);
        expect(res.body[0].quantity).to.equal(data.quantity);
        expect(res.body[0].available).to.equal(data.available);
        expect(res.body[0].description).to.equal(data.description);
        expect(res.body[1].id).to.equal(Number(value2.id));
        expect(res.body[1].name).to.equal(data2.name);
        expect(res.body[1].image).to.equal(data2.image);
        expect(res.body[1].category).to.equal(data2.category);
        expect(res.body[1].quantity).to.equal(data2.quantity);
        expect(res.body[1].available).to.equal(data2.available);
        expect(res.body[1].description).to.equal(data2.description);
    });

    it('should return a specific item from the inventory by ID on /inventory/:id GET', async () => {
        const data = {
            name: 'name',
            image: 'image',
            category: 'category',
            quantity: 2,
            available: true,
            description: 'description',
        };
        const value = await repository.save(data);

        const res = await chai.request(app).get(`/inventory/${value.id}`);
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.be.an('object');

        expect(res.body.id).to.equal(Number(value.id));
        expect(res.body.name).to.equal(data.name);
        expect(res.body.image).to.equal(data.image);
        expect(res.body.category).to.equal(data.category);
        expect(res.body.quantity).to.equal(data.quantity);
        expect(res.body.available).to.equal(data.available);
        expect(res.body.description).to.equal(data.description);
    });

    it('should return items from the inventory by category ID on /inventory/category/:id GET', async () => {
        const data = {
            name: 'name',
            image: 'image',
            category: 'boite',
            quantity: 2,
            available: true,
            description: 'description',
        };
        const value = await repository.save(data);

        const res = await chai.request(app).get('/inventory/category/boite');
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.undefined;
        expect(res.body).to.be.an('array').that.is.not.empty;

        expect(res.body[0].id).to.equal(Number(value.id));
        expect(res.body[0].name).to.equal(data.name);
        expect(res.body[0].image).to.equal(data.image);
        expect(res.body[0].category).to.equal(data.category);
        expect(res.body[0].quantity).to.equal(data.quantity);
        expect(res.body[0].available).to.equal(data.available);
        expect(res.body[0].description).to.equal(data.description);
    });

    it('should Add a new item to the inventory. on /inventory POST', async () => {
        const new_item = {
            name: 'name',
            image: 'image',
            category: 'category',
            quantity: 2,
            available: true,
            description: 'description',
        };

        const res = await chai.request(app).post('/inventory').send(new_item);
        expect(res).to.have.status(201);
        const res2 = await chai.request(app).get(`/inventory/${res.body.identifiers[0].id}`);
        expect(res2).to.have.status(200);

        expect(res2.body.id).to.equal(Number(res.body.identifiers[0].id));
        expect(res2.body.name).to.equal(new_item.name);
        expect(res2.body.image).to.equal(new_item.image);
        expect(res2.body.category).to.equal(new_item.category);
        expect(res2.body.quantity).to.equal(new_item.quantity);
        expect(res2.body.available).to.equal(new_item.available);
        expect(res2.body.description).to.equal(new_item.description);
    });

    it('should Delete an item from the inventory by ID on /inventory/:id DELETE', async () => {
        const data = {
            name: 'name',
            image: 'image',
            category: 'category',
            quantity: 2,
            available: true,
            description: 'description',
        };
        const value = await repository.save(data);

        const res = await chai.request(app).delete(`/inventory/${value.id}`);
        expect(res).to.have.status(202);
        const res2 = await chai.request(app).get(`/inventory/${value.id}`);
        expect(res2).to.have.status(200);
        expect(res2.body).to.equal(null);
    });

    it('should Update an item in the inventory by ID on /inventory/:id PATCH', async () => {
        const data = {
            name: 'name',
            image: 'image',
            category: 'category',
            quantity: 2,
            available: true,
            description: 'description',
        };
        const value = await repository.save(data);
        const new_item = {
            name: 'New name',
            image: 'New image',
            category: 'category',
            quantity: 2,
            available: true,
            description: 'description',
        };

        const res = await chai.request(app).patch(`/inventory/${value.id}`).send(new_item);
        expect(res).to.have.status(200);
        const res2 = await chai.request(app).get(`/inventory/${value.id}`);
        expect(res2).to.have.status(200);

        expect(res2.body.id).to.equal(Number(value.id));
        expect(res2.body.name).to.equal(new_item.name);
        expect(res2.body.image).to.equal(new_item.image);
        expect(res2.body.category).to.equal(new_item.category);
        expect(res2.body.quantity).to.equal(new_item.quantity);
        expect(res2.body.available).to.equal(new_item.available);
        expect(res2.body.description).to.equal(new_item.description);
    });

    afterAll(() => {
        server.close();
    });

});
