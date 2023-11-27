import { Router, Request, Response } from 'express';
import { dataBase } from '../../config/db.js';
import { User } from '../../entity/user.js';

const userRouter = Router();

/**
 * @swagger
 * /users/:
 *  get:
 *     summary: Retrieve all users.
 *     description: Endpoint to get a list of all users.
 *     responses:
 *       200:
 *         description: Successful response with the list of users.
 *       500:
 *         description: Internal Server Error in case of any issues during the retrieval.
 */

userRouter.get('/', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(User).createQueryBuilder('user').getMany();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: 'Error during retrieving the users' });
    }
});

/**
 * @swagger
 * /users/:id:
 *   get:
 *     summary: Retrieve a specific user by ID.
 *     description: Endpoint to get a specific user based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to retrieve.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with the specified user.
 *       500:
 *         description: Internal Server Error in case of any issues during the retrieval.
 */

userRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(User).createQueryBuilder('user').where('user.id = :id', { id: req.params.id }).getOne();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during retrieving the user element ${req.params.id}` });
    }
});

/**
 * @swagger
 * /users/:id:
 *   patch:
 *     summary: Update a user by ID.
 *     description: Endpoint to update a user based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to update.
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Updated data for the user.
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             projects_id: [1, 2, 3, 4]
 *             role: true
 *     responses:
 *       200:
 *         description: Successful response indicating the update of the specified user.
 *       500:
 *         description: Internal Server Error in case of any issues during the update.
 */

userRouter.patch('/:id', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(User).createQueryBuilder('user').update().set(req.body).where('user.id = :id', { id: req.params.id }).execute();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during data update of element ${req.params.id}` });
    }
});

export default userRouter;