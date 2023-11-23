import { Router, Request, Response } from 'express';
import { DataBase } from '../config/db.js';
import { Inventory } from '../entity/inventory.js';

const inventoryRouter = Router();

inventoryRouter.get('/', async (req: Request, res: Response) => {
    try {
        const result = await DataBase.getRepository(Inventory).createQueryBuilder('inventory').getMany();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: 'Error during retrieving the inventory' });
    }
});

inventoryRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const result = await DataBase.getRepository(Inventory).createQueryBuilder('inventory').where('inventory.id = :id', { id: req.params.id }).getOne();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during retrieving the inventory element ${req.params.id}` });
    }
});

inventoryRouter.get('/category/:id', async (req: Request, res: Response) => {
    try {
        const result = await DataBase.getRepository(Inventory).createQueryBuilder('inventory').where('inventory.category = :category', { category: req.params.id }).getMany();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during retrieving the category ${req.params.id}` });
    }
});

inventoryRouter.post('/', async (req: Request, res: Response) => {
    try {
        const result = await DataBase.getRepository(Inventory).createQueryBuilder('inventory').insert().values(req.body).execute();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during data insertion of element ${req.body}` });
    }
});

inventoryRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        await DataBase.getRepository(Inventory).createQueryBuilder('inventory').delete().where('inventory.id = :id', { id: req.params.id }).execute();
        res.status(202).json({ message: `Element ${req.params.id} deleted` });
    } catch (err) {
        res.status(500).json({ err : `Error during data deletion of element ${req.params.id}` });
    }
});

inventoryRouter.patch('/:id', async (req: Request, res: Response) => {
    try {
        const result = await DataBase.getRepository(Inventory).createQueryBuilder('inventory').update().set(req.body).where('inventory.id = :id', { id: req.params.id }).execute();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during data update of element ${req.params.id}` });
    }
});

export default inventoryRouter;