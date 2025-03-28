const mysql = require('mysql2/promise');
const { createPool } = require('mysql2');

// Pool de connexions pour meilleures performances
const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Prévention des injections SQL avec requêtes paramétrées
module.exports = {
    async saveMessage(name, email, service, message) {
        const [result] = await pool.execute(
            'INSERT INTO messages (name, email, service, message, ip_address) VALUES (?, ?, ?, ?, ?)',
            [name, email, service, message, this.getClientIp(req)]
        );
        return result;
    },

    async getMessages(page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const [rows] = await pool.execute(
            'SELECT * FROM messages ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [limit, offset]
        );
        return rows;
    },

    getClientIp(req) {
        return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    }
};