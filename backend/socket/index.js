const express = require('express')
const http = require('http')
const redis = require('redis')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const client = redis.createClient()
const axios = require('axios')

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

client.connect()
    .then(() => {
        io.sockets.on('connection', (socket) => {
            console.log(`${socket.id} has connected`)

            socket.on('user_connected', (id) => {
                client.set(id, socket.id).then(() => console.log(`${socket.id} added`)).catch(err => console.error(err))
                axios.get(`http://localhost:5000/api/notifications/${id}`).then(response => {
                    console.log(response.data)
                })
            })

            socket.on('send_friend_request', (sender_id, receiver_id) => {
                client.get(receiver_id).then(response => {
                    if (response !== 'disconnected') {
                        io.to(response).emit('receive_notification', {
                            type: 'friend_request',
                            from: sender_id
                        })
                    } else {
                        axios.post('http://localhost:5000/api/notifications', {
                            sender_id: sender_id,
                            receiver_id: receiver_id,
                            type: 'friend_request'
                        }).then(response => console.log(response.data)).catch(err => console.error(err))
                    }
                }).catch(err => console.error(err))
            })

            socket.on('user_disconnected', (id) => {
                client.get(id).then(response => {
                    client.set(id, 'disconnected').then(() => console.log(`${id} id set to disconnected`)).catch(err => console.error(err))
                })
            })

            socket.on('disconnect', () => {
                console.log(`${socket.id} has disconnected`)
            })
        })
    }).catch(error => console.error(error))

server.listen(4000, () => {
    console.log('Socket server listening on port 4000')
})


