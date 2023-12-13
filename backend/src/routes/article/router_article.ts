import { Router, Request, Response } from 'express';
import { dataBase } from '../../config/db.js';
import { Article } from '../../entity/article.js';

const articleRouter = Router();

/**
 * @swagger
 * /article/:
 *   get:
 *     tags:
 *       - Article
 *     summary: Retrieve all articles.
 *     description: Endpoint to get a list of all articles.
 *     responses:
 *       200:
 *         description: Successful response with the list of articles.
 *       500:
 *         description: Internal Server Error in case of any issues during the retrieval.
 */

articleRouter.get('/', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(Article).createQueryBuilder('article').getMany();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: 'Error during retrieving the article' });
    }
});

/**
 * @swagger
 * /article/:
 *   post:
 *     tags:
 *       - Article
 *     summary: Add a new article.
 *     description: Endpoint to add a new article.
 *     responses:
 *       201:
 *         description: Successful response with details of the newly added article.
 *       500:
 *         description: Internal Server Error in case of any issues during the insertion.
 */

articleRouter.post('/', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(Article).createQueryBuilder('article').insert().values(req.body).execute();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during data insertion of element ${req.body}` });
    }
});

/**
 * @swagger
 * /article/:id:
 *   delete:
 *     tags:
 *       - Article
 *     summary: Delete an article by ID.
 *     description: Endpoint to delete an article based on its ID.
 *     responses:
 *       202:
 *         description: Successful response indicating the deletion of the specified article.
 *       500:
 *         description: Internal Server Error in case of any issues during the deletion.
 */

articleRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        await dataBase.getRepository(Article).createQueryBuilder('article').delete().where('article.id = :id', { id: req.params.id }).execute();
        res.status(202).json({ message: `Element ${req.params.id} deleted` });
    } catch (err) {
        res.status(500).json({ err : `Error during data deletion of element ${req.params.id}` });
    }
});

/**
 * @swagger
 * /article/:id:
 *   patch:
 *     tags:
 *       - Article
 *     summary: Update an article by ID.
 *     description: Endpoint to update an article based on its ID.
 *     responses:
 *       200:
 *         description: Successful response with details of the updated article.
 *       500:
 *         description: Internal Server Error in case of any issues during the update.
 */

articleRouter.patch('/:id', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(Article).createQueryBuilder('article').update().set(req.body).where('article.id = :id', { id: req.params.id }).execute();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during data update of element ${req.params.id}` });
    }
});

export default articleRouter;