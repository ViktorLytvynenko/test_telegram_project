import dotenv from 'dotenv';

// dotenv.config();

export const config =  {
    db_port: process.env.DB_PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    db: process.env.DB,
    host: process.env.HOST,
};