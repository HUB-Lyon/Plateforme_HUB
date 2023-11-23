import { Router, Request, Response } from "express";
import { dataBase } from "../../config/db.js";
import { Inventory } from "../../entity/inventory.js";

const inventoryRouter = Router();

/**
 * @swagger
 * /inventory/:
 *   get:
 *     summary: Retrieve all items from the inventory.
 *     description: Endpoint to get a list of all items in the inventory.
 *     responses:
 *       200:
 *         description: Successful response with the list of items.
 *       500:
 *         description: Internal Server Error in case of any issues during the retrieval.
 */

inventoryRouter.get('/', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(Inventory).createQueryBuilder('inventory').getMany();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during retrieving the inventory` });
    }
});

/**
 * @swagger
 * /inventory/:id:
 *   get:
 *     summary: Retrieve a specific item from the inventory by ID.
 *     description: Endpoint to get a specific item from the inventory based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the inventory item to retrieve.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with the specified inventory item.
 *       500:
 *         description: Internal Server Error in case of any issues during the retrieval.
 */

inventoryRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(Inventory).createQueryBuilder('inventory').where('inventory.id = :id', { id: req.params.id }).getOne();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during retrieving the inventory element ${req.params.id}` });
    }
});

/**
 * @swagger
 * /inventory/category/:id:
 *   get:
 *     summary: Retrieve items from the inventory by category ID.
 *     description: Endpoint to get a list of items from the inventory based on the category ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the category to retrieve items for.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response with a list of items in the specified category.
 *       500:
 *         description: Internal Server Error in case of any issues during the retrieval.
 */

inventoryRouter.get('/category/:id', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(Inventory).createQueryBuilder('inventory').where('inventory.category = :category', { category: req.params.id }).getMany();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during retrieving the category ${req.params.id}` });
    }
});

/**
 * @swagger
 * /inventory/:
 *   post:
 *     summary: Add a new item to the inventory.
 *     description: Endpoint to add a new item to the inventory.
 *     requestBody:
 *       description: New inventory item to be added.
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Item Name"
 *             image: "URL to Image"
 *             category: "Item Category"
 *             quantity: 10
 *             available: true
 *             description: "Item Description"
 *     responses:
 *       201:
 *         description: Successful response with details of the newly added item.
 *       500:
 *         description: Internal Server Error in case of any issues during the insertion.
 */

inventoryRouter.post('/', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(Inventory).createQueryBuilder('inventory').insert().values(req.body).execute();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during data insertion of element ${req.body}` });
    }
});

/**
 * @swagger
 * /inventory/:id:
 *   delete:
 *     summary: Delete an item from the inventory by ID.
 *     description: Endpoint to delete an item from the inventory based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the inventory item to delete.
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       202:
 *         description: Successful response indicating the deletion of the specified inventory item.
 *       500:
 *         description: Internal Server Error in case of any issues during the deletion.
 */

inventoryRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        await dataBase.getRepository(Inventory).createQueryBuilder('inventory').delete().where('inventory.id = :id', { id: req.params.id }).execute();
        res.status(202).json({ message: `Element ${req.params.id} deleted` });
    } catch (err) {
        res.status(500).json({ err : `Error during data deletion of element ${req.params.id}` });
    }
});

/**
 * @swagger
 * /inventory/:id:
 *   patch:
 *     summary: Update an item in the inventory by ID.
 *     description: Endpoint to update an item in the inventory based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the inventory item to update.
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Updated data for the inventory item.
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: "Updated Item Name"
 *             image: "Updated URL to Image"
 *             category: "Updated Item Category"
 *             quantity: 15
 *             available: false
 *             description: "Updated Item Description"
 *     responses:
 *       200:
 *         description: Successful response with details of the updated inventory item.
 *       500:
 *         description: Internal Server Error in case of any issues during the update.
 */

inventoryRouter.patch('/:id', async (req: Request, res: Response) => {
    try {
        const result = await dataBase.getRepository(Inventory).createQueryBuilder('inventory').update().set(req.body).where('inventory.id = :id', { id: req.params.id }).execute();
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ err: `Error during data update of element ${req.params.id}` });
    }
});

export default inventoryRouter;