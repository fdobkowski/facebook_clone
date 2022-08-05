const post_friendship = (body) => `INSERT INTO friendships (sender_id, receiver_id, date) 
                                     VALUES ('${body.sender_id}', '${body.receiver_id}', '${body.date}');`

const get_friendships = (id) => `SELECT * FROM friendships WHERE (sender_id = '${id}') OR (receiver_id = '${id}');`
const delete_friendship = (body) => `DELETE FROM friendships WHERE (sender_id = '${body.sender_id}' AND receiver_id = '${body.receiver_id}')
                                     OR (receiver_id = '${body.sender_id}' AND sender_id = '${body.receiver_id}');`

module.exports = {
    post_friendship,
    get_friendships,
    delete_friendship
}