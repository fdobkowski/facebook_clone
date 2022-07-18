const express = require('express')
const http = require('http')
const redis = require('redis')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const client = redis.createClient()

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

client.connect()
    .then(() => {
        io.sockets.on('connection', (socket) => {
            console.log(`${socket.id} has connected`)

            socket.on('disconnect', () => console.log(`${socket.id} has disconnected`))
        })
    }).catch(error => console.error(error))

server.listen(4000, () => {
    console.log('Socket server listening on port 4000')
})


