import { Router, Request, Response } from 'express';
import { dataBase } from '../../config/db.js';
import { User } from '../../entity/user.js';

const userRouter = Router();

userRouter.get('/', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(User).createQueryBuilder('user').getMany();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during retrieving the users` });
    }
});

userRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(User).createQueryBuilder('user').where('user.id = :id', { id: req.params.id }).getOne();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during retrieving the user element ${req.params.id}` });
    }
});

userRouter.post('/', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(User).createQueryBuilder('user').insert().values(req.body).execute();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during data insertion of element ${req.body}` });
    }
});

userRouter.patch('/:id', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(User).createQueryBuilder('user').update().set(req.body).where('user.id = :id', { id: req.params.id }).execute();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during data update of element ${req.params.id}` });
    }
});