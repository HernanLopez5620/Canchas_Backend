const mysql = require('mysql2/promise');
<<<<<<< HEAD
const env   = require('../config/env');
=======
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48

let pool;

function getPool() {
    if (!pool) {
        pool = mysql.createPool({
<<<<<<< HEAD
            host:               env.db.host,
            port:               env.db.port,
            user:               env.db.user,
            password:           env.db.password,
            database:           env.db.name,
            waitForConnections: true,
            connectionLimit:    10,
=======
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
        });
    }
    return pool;
}

<<<<<<< HEAD
module.exports = { getPool };
=======
module.exports = { getPool };
>>>>>>> ee0887045723df2bab60499807d8c0d0cfd75e48
