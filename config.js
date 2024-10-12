import dotenv from 'dotenv';

dotenv.config();

export const config =  {
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    db: process.env.NAME,
    host: process.env.HOST
};