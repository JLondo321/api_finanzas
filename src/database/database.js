import mysql from 'mysql2/promise';
import config from '../config.js';

const pool = mysql.createPool({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    port: config.dbPort,
});

const getConnection = async () => {
    const connection = await pool.getConnection();
    return connection; 
};

export { getConnection };


