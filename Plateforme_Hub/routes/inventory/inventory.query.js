const sql = require('../../config/db');
const db = require('../../config/db');

async function get_inventory() {
    try {
        const result = await db`SELECT * FROM inventory`
        return result;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

async function get_item(id) {
    try {
        const result = await db`SELECT * FROM inventory WHERE id = ${sql`${id}`}`
        return result;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

async function get_group_item(category) {
    try {
        const result = await db`SELECT * FROM inventory WHERE category = ${sql`${category}`}`
        return result;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

async function delete_item(id) {
    try {
        await db`DELETE FROM inventory WHERE id = ${sql`${id}`}`
    } catch (error) {
        console.log(error)
        throw error;
    }
}

async function create_item(id, name, quantity, category, description, image) {
    try {
        await db`INSERT INTO inventory (id, name, quantity, category, description, image) VALUES (${sql`${id}`}, ${sql`${name}`}, ${sql`${quantity}`}, ${sql`${category}`}, ${sql`${description}`}, ${sql`${image}`})`
    } catch (error) {
        console.log(error)
        throw error;
    }
}

async function update_item(id, name, quantity, category, description, image) {
    try {
        await db`UPDATE inventory SET name = ${sql`${name}`}, quantity = ${sql`${quantity}`}, category = ${sql`${category}`}, description = ${sql`${description}`}, image = ${sql`${image}`} WHERE id = ${sql`${id}`}`
    } catch (error) {
        console.log(error)
        throw error;
    }
}

module.exports = {
    get_inventory,
    get_item,
    get_group_item,
    delete_item,
    create_item,
    update_item
}