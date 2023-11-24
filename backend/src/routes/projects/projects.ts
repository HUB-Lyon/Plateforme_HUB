import { Router, Request, Response } from 'express';
import { dataBase } from '../../config/db.js';
import { Project } from '../../entity/projects.js';

const projectRouter = Router();

projectRouter.get('/', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(Project).createQueryBuilder('project').getMany();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: 'Error during retrieving the projects' });
    }
});

projectRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(Project).createQueryBuilder('project').where('project.id = :id', { id: req.params.id }).getOne();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during retrieving the project ${req.params.id}` });
    }
});

projectRouter.get('/status/:id', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(Project).createQueryBuilder('project').where('project.status = :status', { status: req.params.id }).getMany();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during retrieving the status ${req.params.id}` });
    }
});

projectRouter.post('/', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(Project).createQueryBuilder('project').insert().values(req.body).execute();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during data insertion of project ${req.body}` });
    }
});

projectRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        await dataBase.getRepository(Project).createQueryBuilder('project').delete().where('project.id = :id', { id: req.params.id }).execute();
        res.status(202).json({ message: `Project ${req.params.id} deleted` });
    } catch (err) {
        res.status(500).json({ err: `Error during data deletion of project ${req.params.id}` });
    }
});

projectRouter.patch('/:id', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(Project).createQueryBuilder('project').update().set(req.body).where('project.id = :id', { id: req.params.id }).execute();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during data update of project ${req.params.id}` });
    }
});

export default projectRouter;