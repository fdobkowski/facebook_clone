const post_notification = (body) => `INSERT INTO notifications (sender_id, receiver_id, type) 
                                     VALUES ('${body.sender_id}', '${body.receiver_id}', '${body.type}');`
const get_notifications = (id) => `SELECT * FROM notifications WHERE (receiver_id = '${id}');`

module.exports = {
    post_notification,
    get_notifications
}