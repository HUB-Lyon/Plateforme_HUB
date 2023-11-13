const express = require("express");
const { get_project, get_project_by_id, get_project_by_status, create_project, modify_project, delete_project } = require("./project.query");

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const data = await get_project(req.body.id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await get_project_by_id(req.body.id, req.params.id);
        if (data.length == 0) {
            res.status(404).json({ error: 'Projet non trouvé' });
        } else {
            res.status(200).json(data);
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
});

router.get('/:status', async (req, res) => {
    try {
        const data = await get_project_by_status(req.body.id, req.params.status);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
});

router.post('/:id', async (req, res) => {
    try {
        await create_project(req.params.id, req.body.name, req.body.description, req.leader_id, req.body.member_id, req.body.status);
        res.json({"msg": "Création du projet " + req.body.name + " réussie"});
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la création du projet' });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        await modify_project(req.params.id, req.body.name, req.body.description, req.leader_id, req.body.member_id, req.body.status);
        res.json({"msg": "Modification du projet " + req.body.name + " réussie"});
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la modification du projet' });
    }
});

router.delete('/:id',  async (req, res) => {
    try {
        await delete_project(req.params.id);
        res.json({"msg": "Supression du projet " + req.params.id + " réussie"});
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la supression du projet' });
    }
});

module.exports = router;