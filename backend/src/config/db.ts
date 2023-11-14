import dotenv from 'dotenv';
import postgres from 'postgres';

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

interface ConnectionOptions {
    host: string;
    database: string;
    username: string;
    password: string;
    port: number;
    ssl: 'require';
    connection: {
        options: string;
    };
}

const options: ConnectionOptions = {
    host: PGHOST!,
    database: PGDATABASE!,
    username: PGUSER!,
    password: PGPASSWORD!,
    port: 5432,
    ssl: 'require',
    connection: {
        options: `project=${ENDPOINT_ID}`,
    },
};

const sqlClient = postgres(options);

export default sqlClient;
