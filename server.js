import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';
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
    console.log("Received POST request:", req.body);
    const userData = req.body;

    if (!userData) {
        return res.status(400).json({ message: 'Invalid data provided' });
    }

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
        console.log("Insert result:", result);
        res.status(201).json({ message: 'Data successfully saved' });
    } catch (err) {
        console.error("Database insert error:", err);
        res.status(500).json({ message: 'Error saving data' });
    }
});

app.get('/api/admin', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const totalCountQuery = 'SELECT COUNT(*) AS count FROM users';
        const totalCountResult = await pool.query(totalCountQuery);
        const totalCount = totalCountResult.rows[0].count;

        const query = 'SELECT * FROM users LIMIT $1 OFFSET $2';
        const result = await pool.query(query, [limit, offset]);

        res.status(200).json({
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            users: result.rows
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

app.get('/api/user/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
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
