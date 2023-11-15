import express , {Router, Request, Response} from 'express';
import sqlClient from './config/db.js';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});
