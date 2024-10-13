import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg; // Получаем Pool из pkg

const pool = new Pool({
    connectionString: process.env.URI,
    ssl: {
        rejectUnauthorized: false
    },
});

export { pool };