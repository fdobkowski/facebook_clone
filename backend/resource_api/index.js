const express = require('express')
const userRoute = require('./users/users')
const profileRoute = require('./profiles/profiles')
const postRoute = require('./posts/posts')
const loginRoute = require('./login/login')
const protectedUserRoute = require('./protected/protected_users')
const protectedProfileRoute = require('./protected/protected_profiles')
const protectedPosts = require('./protected/protected_posts')

const app = express()

app.use(express.json())
app.use(require('cors')())
app.use('/api/users', userRoute)
app.use('/api/profiles', profileRoute)
app.use('/api/posts', postRoute)
app.use('/api/login', loginRoute)
app.use('/api/protected/users', protectedUserRoute)
app.use('/api/protected/profiles', protectedProfileRoute)
app.use('/api/protected/posts', protectedPosts)

const { Client } = require('pg')
const pool = require('./Pool')

require('dotenv').config()
const dbConnData = {
    host: process.env.PGHOST || '127.0.0.1',
    port: process.env.PGPORT || 5432,
    database: process.env.PGDATABASE || 'postgres',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD
}

const client = new Client(dbConnData)

const queries = require('./init_queries')

client.connect().then(async () => {
    await client.query("SELECT datname FROM pg_database;", async (err, result) => {
        if (err) throw err
        if (result.rows.find(x => x['datname'] === 'facebook_db') === undefined) {
            await client.query(queries.create_database, async (err) => {
                if (err) throw err
                console.log("Created database facebook_db")
                await pool.query(queries.users_table, (err) => {
                    if (err) throw err
                    console.log("Created table users")
                })
                await pool.query(queries.profiles_table, async (err) => {
                    if (err) throw err
                    console.log("Created table profiles")
                    await pool.query(queries.posts_table, (err) => {
                        if (err) throw err
                        console.log("Created table posts")
                    })
                })
            })
        }
    })

    app.listen(5000, () => {
        console.log("Api listening on port 5000")
    })
}).catch(err => console.error('Connection error', err.stack))
