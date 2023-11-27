import chai from 'chai';
import chaiHttp from 'chai-http';
import { app , server } from '../src/app.js';

chai.use(chaiHttp);
const expect = chai.expect;

describe('App', () => {
  it('should return "Hello World" on / GET', async () => {
    const res = await chai.request(app).get('/');
    expect(res).to.have.status(200);
    expect(res.text).to.equal('Hello World');
  });

  afterAll(() => {
    server.close();
  });

});