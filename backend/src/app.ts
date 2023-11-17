import express, { Request, Response } from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';

import usersRouter from './routes/users/router_users.js';
import authRouter from './routes/auth/auth.js';

dotenv.config({ path: '.env' });

const app = express();
const port = 3000;

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

app.use('/users', usersRouter);
app.use('/auth', authRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
