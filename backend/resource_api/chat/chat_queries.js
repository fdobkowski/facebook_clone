const get_chat = (sender_id, receiver_id) => `SELECT * FROM chat WHERE (sender_id = '${sender_id}' AND receiver_id = '${receiver_id}')
                                                OR (sender_id = '${receiver_id}' AND receiver_id = '${sender_id}');`

const create_chat = (body) => `INSERT INTO chat (id, sender_id, receiver_id) VALUES ('${body.id}', '${body.sender_id}', '${body.receiver_id}');`

module.exports = {
    get_chat,
    create_chat
}