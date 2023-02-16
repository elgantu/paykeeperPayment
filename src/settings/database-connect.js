const mysql = require('mysql2');

const connection = mysql.createPool({
    connectionLimit: process.env.COUNT_POOL_CONNECTIONS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database:  process.env.DB_NAME,
    namedPlaceholders: true
});

connection.getConnection((error) => {
    if (error) {
        return console.log('Connection error')
    } else {
        return console.log('Connection successful.')
    }
})

module.exports = connection;