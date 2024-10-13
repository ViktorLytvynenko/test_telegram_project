import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';
import { config } from './config.js';
import * as bodyParser from "express";

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/auth', auth);

app.post('/api/data', async (req, res) => {
    const userData = req.body;

    try {
        const query = `
      INSERT INTO users (id, first_name, username, auth_date, hash)
      VALUES ($1, $2, $3, $4, $5)
    `;
        const values = [
            userData.user.id,
            userData.user.first_name,
            userData.user.username,
            userData.user.auth_date,
            userData.user.hash,
        ];

        await pool.query(query, values);
        res.status(201).json({ message: 'Данные успешно сохранены' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ошибка при сохранении данных' });
    }
});


const PORT = process.env.PORT || 9000

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
