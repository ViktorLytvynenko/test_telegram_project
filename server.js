import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
    connectionString: process.env.URI,
    ssl: {
        rejectUnauthorized: false // Убедитесь, что это безопасно для вашей среды
    },
});

app.post('/api/data', async (req, res) => {
    console.log(req.body);

    const userData = req.body;

    const authDateUnix = userData.auth_date;
    const authDate = new Date(authDateUnix * 1000).toISOString();

    try {
        const query = `
            INSERT INTO users (telegram_id, first_name, username, auth_date, hash)
            VALUES ($1, $2, $3, $4, $5)
        `;
        const values = [
            userData.telegram_id,
            userData.user.first_name,
            userData.user.username,
            authDate,
            userData.user.hash,
        ];

        const result = await pool.query(query, values);

        if (result.rowCount > 0) {
            return res.status(201).json({ message: 'Data successfully saved' });
        } else {
            return res.status(400).json({ message: 'No data was saved' });
        }
    } catch (err) {
        console.error("Error saving data:", err);
        return res.status(500).json({ message: 'Error saving data' });
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
