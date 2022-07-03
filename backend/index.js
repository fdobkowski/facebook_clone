const express = require('express')
const app = express()

app.use(express.json())

const { Client } = require('pg')

require('dotenv').config()
const dbConnData = {
    host: process.env.PGHOST || '127.0.0.1',
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE || 'postgres',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD
}

const client = new Client(dbConnData)

client.connect().then(() => {
    client.query("SELECT datname FROM pg_database;", (err, result) => {
        if (err) throw err
        if (result.rows.find(x => x['datname'] === 'facebook_db') === undefined) {
            client.query("CREATE DATABASE facebook_db;", (err1) => {
                if (err1) throw err1
                console.log("Created database facebook_db")
            })
        }
    })

    app.listen(5000, () => {
        console.log("Api listening on port 5000")
    })
}).catch(err => console.error('Connection error', err.stack))
