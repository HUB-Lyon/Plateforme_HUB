import { Router, Request, Response } from 'express';
import { dataBase } from '../../config/db.js';
import { Article } from '../../entity/article.js';

const articleRouter = Router();

articleRouter.get('/', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(Article).createQueryBuilder('article').getMany();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: 'Error during retrieving the article' });
    }
});

articleRouter.post('/', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(Article).createQueryBuilder('article').insert().values(req.body).execute();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during data insertion of element ${req.body}` });
    }
});

articleRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        await dataBase.getRepository(Article).createQueryBuilder('article').delete().where('article.id = :id', { id: req.params.id }).execute();
        res.status(202).json({ message: `Element ${req.params.id} deleted` });
    } catch (err) {
        res.status(500).json({ err : `Error during data deletion of element ${req.params.id}` });
    }
});

export default articleRouter;