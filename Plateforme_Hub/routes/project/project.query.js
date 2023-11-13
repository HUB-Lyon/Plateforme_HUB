const sql = require('../../config/db');
const db = require('../../config/db');

async function get_project(user_id) {
    try {
        const result = await db`SELECT * FROM project WHERE ${sql`${user_id}`} = ANY(member_id)`
        return result;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

async function get_project_by_id(user_id, project_id) {
    try {
        const result = await db`SELECT * FROM project WHERE ${sql`${user_id}`} = ANY(member_id) and id = ${sql`${project_id}`}`
        return result;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

async function get_project_by_status(user_id, status) {
    try {
        const result = await db`SELECT * FROM project WHERE ${sql`${user_id}`} = ANY(member_id) and status = ${sql`${status}`}`
        return result;
    } catch (error) {
        console.log(error)
        throw error;
    }
}

async function create_project(id, name, description, leader_id, member_id, status) {
    try {
        await db`INSERT INTO project (id, name, description, leader_id, member_id, status) VALUES (${sql`${id}`}, ${sql`${name}`}, ${sql`${description}`}, ${sql`${leader_id}`}, ${sql`${member_id}`}, ${sql`${status}`})`
    } catch (error) {
        console.log(error)
        throw error;
    }
}

async function modify_project(id, name, description, leader_id, member_id, status) {
    try {
        await db`UPDATE INTO project (name, description, leader_id, member_id, status) VALUES (${sql`${name}`}, ${sql`${description}`}, ${sql`${leader_id}`}, ${sql`${member_id}`}, ${sql`${status}`}) WHERE id = ${sql`${id}`}`
    } catch (error) {
        console.log(error)
        throw error;
    }
}

async function delete_project(id) {
    try {
        await db`DELETE FROM project WHERE id = ${sql`${id}`} and status = 'pending'`
    } catch (error) {
        console.log(error)
        throw error;
    }
}

module.exports = {
    get_project,
    get_project_by_id,
    get_project_by_status,
    create_project,
    modify_project,
    delete_project
}