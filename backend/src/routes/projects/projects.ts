import { Router, Request, Response } from 'express';
import { dataBase } from '../../config/db.js';
import { Project } from '../../entity/projects.js';

const projectRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The project ID.
 *           example: 1
 *         name:
 *           type: string
 *           description: The project name.
 *           example: My Project
 *         description:
 *           type: string
 *           description: The project description.
 *           example: This is a sample project.
 *         image:
 *           type: string
 *           description: The image URL for the project.
 *           example: https://example.com/project-image.jpg
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the project was created.
 *           example: '2023-11-24T12:34:56Z'
 *         leaderId:
 *           type: integer
 *           description: The ID of the project leader.
 *           example: 123
 *         membersId:
 *           type: array
 *           items:
 *             type: integer
 *           description: An array of member IDs.
 *           example: [456, 789]
 *         status:
 *           type: string
 *           description: The status of the project.
 *           example: Active
 */

/**
 * @swagger
 * /projects/:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Retrieve all projects.
 *     description: Endpoint to get a list of all projects.
 *     responses:
 *       200:
 *         description: Successful response with the list of projects.
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Project'
 *       500:
 *         description: Internal Server Error in case of any issues during the retrieval.
 */

projectRouter.get('/', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(Project).createQueryBuilder('project').getMany();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: 'Error during retrieving the projects' });
    }
});

/**
 * @swagger
 * /projects/:id:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Retrieve a specific project by ID.
 *     description: Endpoint to get a specific project based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the project to retrieve.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with the details of the project.
 *         schema:
 *           $ref: '#/components/schemas/Project'
 *       500:
 *         description: Internal Server Error in case of any issues during the retrieval.
 */

projectRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(Project).createQueryBuilder('project').where('project.id = :id', { id: req.params.id }).getOne();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during retrieving the project ${req.params.id}` });
    }
});

/**
 * @swagger
 * /projects/status/:id:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Retrieve projects by status ID.
 *     description: Endpoint to get a list of projects based on their status ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the project status to filter projects.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with the list of projects matching the status ID.
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Project'
 *       500:
 *         description: Internal Server Error in case of any issues during project retrieval by status.
 */

projectRouter.get('/status/:id', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(Project).createQueryBuilder('project').where('project.status = :status', { status: req.params.id }).getMany();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during retrieving the status ${req.params.id}` });
    }
});

/**
 * @swagger
 * /projects/:
 *   post:
 *     tags:
 *       - Projects
 *     summary: Create a new project.
 *     description: Endpoint to create a new project.
 *     requestBody:
 *       description: Project data to be inserted.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       201:
 *         description: Successful response indicating the project has been created.
 *         schema:
 *           type: object
 *           properties:
 *             raw:
 *               type: array
 *               description: An array containing the details of the inserted project.
 *       500:
 *         description: Internal Server Error in case of any issues during project creation.
 */

projectRouter.post('/', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(Project).createQueryBuilder('project').insert().values(req.body).execute();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during data insertion of project ${req.body}` });
    }
});

/**
 * @swagger
 * /projects/:id:
 *   delete:
 *     tags:
 *       - Projects
 *     summary: Delete a project by ID.
 *     description: Endpoint to delete a project based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the project to delete.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       202:
 *         description: Successful response indicating the deletion of the specified project.
 *       500:
 *         description: Internal Server Error in case of any issues during the deletion.
 */

projectRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        await dataBase.getRepository(Project).createQueryBuilder('project').delete().where('project.id = :id', { id: req.params.id }).execute();
        res.status(202).json({ message: `Project ${req.params.id} deleted` });
    } catch (err) {
        res.status(500).json({ err: `Error during data deletion of project ${req.params.id}` });
    }
});

/**
 * @swagger
 * /projects/:id:
 *   patch:
 *     tags:
 *       - Projects
 *     summary: Update a project by ID.
 *     description: Endpoint to update a project based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the project to update.
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Project data to be updated.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Project'
 *     responses:
 *       200:
 *         description: Successful response indicating the update of the specified project.
 *       500:
 *         description: Internal Server Error in case of any issues during the update.
 */

projectRouter.patch('/:id', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(Project).createQueryBuilder('project').update().set(req.body).where('project.id = :id', { id: req.params.id }).execute();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during data update of project ${req.params.id}` });
    }
});

export default projectRouter;