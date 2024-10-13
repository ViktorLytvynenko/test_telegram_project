import { pool } from '../server.js'; // Импортируем экземпляр pool из вашего основного файла
import dotenv from 'dotenv';

dotenv.config();

class UserModel {
    // Создание нового пользователя
    static async createUser(username, first_name, last_name, telegram_id) {
        const query = `
            INSERT INTO users (username, first_name, last_name, telegram_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [username, first_name, last_name, telegram_id];

        try {
            const result = await pool.query(query, values);
            return result.rows[0]; // Возвращаем созданного пользователя
        } catch (error) {
            console.error('Error creating user:', error);
            throw error; // Пробрасываем ошибку дальше
        }
    }

    // Получение пользователя по telegram_id
    static async getUserByTelegramId(telegram_id) {
        const query = `
            SELECT * FROM users
            WHERE telegram_id = $1;
        `;
        const values = [telegram_id];

        try {
            const result = await pool.query(query, values);
            return result.rows[0]; // Возвращаем найденного пользователя или null
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error; // Пробрасываем ошибку дальше
        }
    }
}

export default UserModel;