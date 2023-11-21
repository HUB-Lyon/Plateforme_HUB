import { Router, Request, Response } from "express";
import { myDataSource } from "../config/db.js";
import { Inventory } from "../entity/inventory.js";

const inventoryRouter = Router();

inventoryRouter.get('/', async (req: Request, res: Response) => {
    try {
        const result = await myDataSource.getRepository(Inventory).createQueryBuilder('inventory').getMany();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during data retrieval` });
    }
});

inventoryRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const result = await myDataSource.getRepository(Inventory).createQueryBuilder('inventory').where('inventory.id = :id', { id: req.params.id }).getOne();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during data retrieval` });
    }
});

inventoryRouter.get('/category/:id', async (req: Request, res: Response) => {
    try {
        const result = await myDataSource.getRepository(Inventory).createQueryBuilder('inventory').where('inventory.category = :category', { category: req.params.id }).getMany();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during data retrieval` });
    }
});

inventoryRouter.post('/', async (req: Request, res: Response) => {
    try {
        await myDataSource.getRepository(Inventory).createQueryBuilder('inventory').insert().values(req.body).execute();
        res.status(200).json({ message: `Data inserted` });
    } catch (err) {
        res.status(500).json({ err: `Error during data insertion` });
    }
});

inventoryRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        await myDataSource.getRepository(Inventory).createQueryBuilder('inventory').delete().where('inventory.id = :id', { id: req.params.id }).execute();
        res.status(200).json({ message: `Data deleted` });
    } catch (err) {
        res.status(500).json({ err : `Error during data deletion` });
    }
});

inventoryRouter.patch('/:id', async (req: Request, res: Response) => {
    try {
        await myDataSource.getRepository(Inventory).createQueryBuilder('inventory').update().set(req.body).where('inventory.id = :id', { id: req.params.id }).execute();
        res.status(200).json({ message: `Data updated` });
    } catch (err) {
        res.status(500).json({ err: `Error during data update` });
    }
});

export default inventoryRouter;