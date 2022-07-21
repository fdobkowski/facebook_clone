const express = require('express')
const http = require('http')
const redis = require('redis')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const client = redis.createClient()
const axios = require('axios')

const uuid = require('uuid').v4

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
                    response.data.map(x => {
                        io.to(socket.id).emit('receive_notification', {
                            id: x.id,
                            type: x.type,
                            from: x.sender_id,
                            seen: x.seen
                        })
                    })
                })
            })

            socket.on('send_friend_request', (data) => {
                client.get(data.receiver_id).then(response => {
                    if (response) {
                        const notification_id = uuid()
                        axios.post('http://localhost:5000/api/notifications', {
                            id: notification_id,
                            sender_id: data.sender_id,
                            receiver_id: data.receiver_id,
                            type: 'friend_request'
                        }).then(() => {
                            if (response !== 'disconnected') {
                                axios.get(`http://localhost:5000/api/notifications/single/${notification_id}`)
                                    .then((result => {
                                        io.to(response).emit('receive_notification', {
                                            id: result.data.id,
                                            type: result.data.type,
                                            from: result.data.sender_id,
                                            seen: result.data.seen
                                        })
                                    })).catch(err => console.error(err))
                            }
                        }).catch(err => console.error(err))
                    } else console.log('User does not exist')
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


