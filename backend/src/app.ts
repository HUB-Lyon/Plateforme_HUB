import express, { Request, Response } from 'express';
import { dataBase } from './config/db.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';

import authRouter from './routes/auth/auth.js';
import inventoryRouter from './routes/inventory/inventory.js';
import projectRouter from './routes/projects/projects.js';
import usersRouter from './routes/users/router.users.js';
import articleRouter from './routes/article/router_article.js';

const swaggerSpec = swaggerJSDoc({
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Plateforme HUB',
            version: '1.0.0',
        },
    },
    apis: ['dist/routes/**/*.js'],
});

dotenv.config({ path: '.env' });

const app = express();
const port = 3000;

if (!process.env.DEBUG) {
    dataBase
        .initialize()
        .then(() => {
            console.log('database connected');
        })
        .catch((err) => {
            console.log('Error connecting to database', err);
        });
}

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

if (!process.env.DEBUG)
    app.use(logger(process.env.NODE_ENV === 'prod' ? 'common' : 'dev'));

app.use(cors());
app.use(logger(process.env.NODE_ENV === 'prod' ? 'common' : 'dev'));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: false }));

app.use('/auth', authRouter);
app.use('/inventory', inventoryRouter);
app.use('/projects', projectRouter);
app.use('/users', usersRouter);
app.use('/article', articleRouter);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});

const server = app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});

export { server, app, dataBase };
