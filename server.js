import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';
import { config } from './config.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Use express.urlencoded instead of bodyParser

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

app.get('/', (req, res) => {
    console.log("TEST");
    res.send("TEST");
});

app.post('/api/data', async (req, res) => {
    const userData = req.body;

    try {
        const query = `
            INSERT INTO users (telegram_id, first_name, username, auth_date, hash, phone_number)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        const values = [
            userData.user.id,
            userData.telegram_id,
            userData.user.first_name,
            userData.user.username,
            userData.user.auth_date,
            userData.user.hash,
            userData.phone_number
        ];

        await pool.query(query, values);
        res.status(201).json({ message: 'Data successfully saved' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving data' });
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
