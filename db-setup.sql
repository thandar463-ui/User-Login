CREATE DATABASE IF NOT EXISTS todo_db;

USE todo_db;

CREATE TABLE todos (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    description TEXT,
    user_id VARCHAR(255),
    created_at DATE NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_title UNIQUE (title),

    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(30) NOT NULL,
    password VARCHAR(255) NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATE NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_email UNIQUE (email)
);

CREATE TABLE otps (
    id VARCHAR(255) PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    email VARCHAR(30) NOT NULL,
    user_id VARCHAR(255),

    created_at DATE NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_code UNIQUE (code),

    FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE todos
ADD COLUMN user_id VARCHAR(255) NOT NULL,
ADD FOREIGN KEY (user_id)
    REFERENCES users(id);
