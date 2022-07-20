const post_friendship = (body) => `INSERT INTO friendships (sender_id, receiver_id, date) 
                                     VALUES ('${body.sender_id}', '${body.receiver_id}', '${body.date}');`

module.exports = {
    post_friendship
}