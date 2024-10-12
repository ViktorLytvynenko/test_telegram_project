import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';
import { config } from './config.js';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 9000;

const pool = new Pool({
    user: config.user,
    password: config.password,
    database: config.db,
    host: config.host,
    port: config.port
});

const application = async () => {
    try {
        await pool.connect();
        console.log("DB connected")
        app.listen(PORT, () => {
            console.log(`Server was started on PORT ${PORT}`);
        })
    } catch (e) {
        console.log(e)
    }
}

application()
