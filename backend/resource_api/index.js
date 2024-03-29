const express = require('express')
const userRoute = require('./users/users')
const profileRoute = require('./profiles/profiles')
const postRoute = require('./posts/posts')
const loginRoute = require('./login/login')
const notificationsRoute = require('./notifications/notifications')
const friendshipsRoute = require('./friendships/friendships')
const chatRoute = require('./chat/chat')
const messagesRoute = require('./chat/messages')

const app = express()

app.use(express.json())
app.use(require('cors')())
app.use('/api/users', userRoute)
app.use('/api/profiles', profileRoute)
app.use('/api/posts', postRoute)
app.use('/api/login', loginRoute)
app.use('/api/notifications', notificationsRoute)
app.use('/api/friendships', friendshipsRoute)
app.use('/api/chat', chatRoute)
app.use('/api/messages', messagesRoute)

const { Client } = require('pg')
const pool = require('./Pool')

require('dotenv').config()
const dbConnData = {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
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
                    await pool.query(queries.notifications_table, (err) => {
                        if (err) throw err
                        console.log('Created table notifications')
                    })

                    await pool.query(queries.friendships_table, (err) => {
                        if (err) throw err
                        console.log('Created table friendships')
                    })

                    await pool.query(queries.chat_table, async (err) => {
                        if (err) throw err
                        console.log('Created table chat')
                        await pool.query(queries.messages_table, (err) => {
                            if (err) throw err
                            console.log('Created table messages')
                        })
                    })
                })
            })
        }
    })

    app.listen(5000, () => {
        console.log("Api listening on port 5000")
    })
}).catch(err => console.error('Connection error', err.stack))
