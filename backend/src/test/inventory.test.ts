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
        .then(() => {
            console.log('database connected');
        })
        .catch((err) => {
            console.log('Error connecting to database', err);
        });
        repository = dataBase.getRepository(Inventory);
    });
    afterEach(async () => {
        await repository.query('DELETE from inventory;');
      });
    it('should return "[]" on /inventory GET', async () => {
        await repository.save({
            id: 1,
            name: 'test',
            image: 'testimage',
            category: 'salut',
            quantity: 2,
            available: true,
            description: 'ici',
        });
        const res = await chai.request(app).get('/inventory');
        expect(res).to.have.status(200);
        expect(res.text).to.equal('[{"id":1,"name":"test","image":"testimage","category":"salut","quantity":2,"available":true,"description":"ici"}]');
    });

    afterAll(() => {
        server.close();
    });

});
