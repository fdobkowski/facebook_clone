const { Pool } = require('pg')

require('dotenv').config()
const dbConnData = {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: 'facebook_db',
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
}
const pool = new Pool(dbConnData)

module.exports = pool