CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        telegram_id BIGINT UNIQUE NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        username VARCHAR(50),
        auth_date TIMESTAMP,
        hash VARCHAR(255),
        phone_number VARCHAR(20),
        create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);