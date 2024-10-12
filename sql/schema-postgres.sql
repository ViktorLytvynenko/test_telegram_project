CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    telegram_id BIGINT UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20),
    username VARCHAR(50),
    language VARCHAR(20),
    profile_picture VARCHAR(255),
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);