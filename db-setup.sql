CREATE DATABASE IF NOT EXISTS user_db;
USE user_db;


CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATE NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_email UNIQUE (email)
);