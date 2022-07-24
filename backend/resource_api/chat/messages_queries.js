const send_message = (body) => `INSERT INTO messages (id, message, sender_id, date) VALUES ('${body.id}', '${body.message}', '${body.sender_id}', '${body.date}');`

const get_messages = (id) => `SELECT * FROM messages WHERE (id = '${id}');`

module.exports = {
    send_message,
    get_messages
}