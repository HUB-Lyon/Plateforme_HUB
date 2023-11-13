const express = require("express");
const { get_inventory, get_item, get_group_item, delete_item, create_item, update_item } = require("./inventory.query");

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await get_inventory();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await get_item(req.params.id);
        if (data.length == 0) {
            res.status(404).json({ error: 'Objet non trouvé' });
        } else {
            res.status(200).json(data);
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await get_group_item(req.params.category);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
});

router.delete('/:id',  async (req, res) => {
    try {
        await delete_item(req.params.id);
        res.json({"msg": "Supression de l'objet " + req.params.id + " réussie"});
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la supression de l\'objet' });
    }
});

router.post('/:id', async (req, res) => {
    try {
        await create_item(req.params.id, req.body.name, req.body.quantity, req.body.category, req.body.description, req.body.image);
        res.json({"msg": "Création de l'objet " + req.body.name + " réussie"});
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création de l\'objet' });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        await update_item(req.params.id, req.body.name, req.body.quantity, req.body.category, req.body.description, req.body.image);
        res.json({"msg": "Modification de l'objet " + req.body.name + " réussie"});
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la modification de l\'objet' });
    }
});

module.exports = router;
