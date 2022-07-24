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

const online_users = () => {
    client.keys('*').then(async response => {
        response.map(async (x, i) => {
            if (i === 0) console.log('\n----- Online users -----')

            await client.get(x).then(response => {
                if (response !== 'disconnected') console.log(response)
            }).catch(err => console.error(err))

            if (i === response.length - 1) console.log('------------------------\n')
        })
    }).catch(err => console.error(err))
}

client.connect()
    .then(() => {
        io.sockets.on('connection', (socket) => {

            online_users()
            socket.on('user_connected', (id) => {
                client.set(id, socket.id).then().catch(err => console.error(err))
                axios.get(`http://localhost:5000/api/notifications/${id}`).then(response => {
                    io.to(socket.id).emit('receive_old_notifications', response.data.reverse())
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
                    }
                }).catch(err => console.error(err))
            })

            socket.on('join_chat', async (data) => {
                axios.get(`http://localhost:5000/api/chat/${data.sender_id}/${data.receiver_id}`)
                    .then(async response => {
                        if (response.data.length === 0) {
                            const id = uuid()
                            await axios.post('http://localhost:5000/api/chat', {
                                id: id,
                                sender_id: data.sender_id,
                                receiver_id: data.receiver_id
                            }).then(() => {
                                io.to(socket.id).emit('enable_chat', {receiver_id: data.receiver_id, chat_id: id})
                            }).catch(err => console.error(err))
                        } else {
                            await axios.get(`http://localhost:5000/api/messages/${response.data.id}`)
                                .then((result) => {
                                    io.to(socket.id).emit('enable_chat', {receiver_id: data.receiver_id, chat_id: response.data.id})
                                    io.to(socket.id).emit('receive_old_messages', result.data)
                                })
                                .catch(err => console.error(err))
                        }
                    }).catch(err => console.error(err))
            })

            socket.on('send_message', async (data) => {
                await axios.post('http://localhost:5000/api/messages', data.data)
                    .then((response) => console.log(response.data)).catch(err => console.error(err))

                client.get(data.receiver_id).then(response => {
                    if (response) {
                        if (response !== 'disconnected') {
                            io.to(response).emit('receive_message', data.data)
                        }
                    }
                }).catch(err => console.error(err))
            })

            socket.on('user_disconnected', (id) => {
                client.get(id).then(response => {
                    client.set(id, 'disconnected').then().catch(err => console.error(err))
                })
            })

            socket.on('disconnect', () => {
                online_users()
            })
        })
    }).catch(error => console.error(error))

server.listen(4000, () => {
    console.log('Socket server listening on port 4000')
})


