import express , {Application, Request, Response} from 'express';
import { DataBase } from './config/db.js';
import inventoryRouter from './routes/inventory.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';

import usersRouter from './routes/users/router_users.js';
import authRouter from './routes/auth/auth.js';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  apis: [`dist/routes/**/*.js`],
};

const swaggerSpec = swaggerJSDoc(options);

dotenv.config({ path: '.env' });

const app: Application = express();
const port = 3000;

DataBase
  .initialize()
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
  });

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
    httpOnly: true,
    secure: false,
    },
  })
);

app.use(logger(process.env.NODE_ENV === 'prod' ? 'common' : 'dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use('/inventory', inventoryRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

const server = app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});

export { app , server };
