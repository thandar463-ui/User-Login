CREATE DATABASE IF NOT EXISTS todo_db;

USE todo_db;

CREATE TYPE admin_role AS ENUM ( 
    'SUPER_ADMIN',
    'ADMIN',
    'MANAGER'
);

CREATE TYPE admin_status AS ENUM ( 
    'INVITED',
    'ACTIVE',
    'DELETED'
);

CREATE TABLE admins (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role admin_role NOT NULL,
    status admin_status NOT NULL DEFAULT 'INVITED',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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


ALTER TABLE users
ADD COLUMN status VARCHAR(20) DEFAULT 'pending';
