const { Pool } = require('pg')

require('dotenv').config()
const dbConnData = {
    host: process.env.PGHOST || '127.0.0.1',
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE || 'facebook_db',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD
}
const pool = new Pool(dbConnData)

module.exports = pool