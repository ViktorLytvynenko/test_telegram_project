import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';
import { config } from './config.js';
import dotenv from "dotenv";

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

const pool = new Pool({
    connectionString: process.env.URI,
    ssl: {
        rejectUnauthorized: false
    },
});

app.post('/api/data', async (req, res) => {
    // Тестовые данные
    const userData = {
        id: 370942103,
        first_name: "Viktor",
        username: "viktor_persona",
        auth_date: 1728855058,
        hash: "7b40f2680bcb5d71aaa09fd4d79b53b815f04fbbdca2638b4ae99d27f0cd5beb"
    };

    console.log("Полученные тестовые данные:", userData);

    const authDateUnix = userData.auth_date;
    const authDate = new Date(authDateUnix * 1000).toISOString();

    try {
        const query = `
            INSERT INTO users (telegram_id, first_name, username, auth_date, hash)
            VALUES ($1, $2, $3, $4, $5)
        `;
        const values = [
            userData.id,
            userData.first_name,
            userData.username,
            authDate,
            userData.hash,
        ];

        const result = await pool.query(query, values);
        console.log("Результат вставки:", result);
        res.status(201).json({ message: 'Данные успешно сохранены' });
    } catch (err) {
        console.error("Ошибка вставки в базу данных:", err);
        res.status(500).json({ message: 'Ошибка сохранения данных', error: err.message });
    }
});

const PORT = process.env.PORT || 9000;

const application = async () => {
    try {
        await pool.connect();
        console.log("DB connected");
        app.listen(PORT, () => {
            console.log(`Server started on PORT ${PORT}`);
        });
    } catch (e) {
        console.error("DB connection error:", e);
    }
};

application();
