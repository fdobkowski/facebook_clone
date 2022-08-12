const post_notification = (body) => `INSERT INTO notifications (id, sender_id, receiver_id, date, type, seen, status) 
                                     VALUES ('${body.id}', '${body.sender_id}', '${body.receiver_id}', '${body.date}', '${body.type}', false, 'pending');`
const get_notifications = (id) => `SELECT * FROM notifications WHERE (receiver_id = '${id}');`
const get_sent_notifications = (id) => `SELECT * FROM notifications WHERE (sender_id = '${id}');`
const get_single_notification = (id) => `SELECT * FROM notifications WHERE (id = '${id}');`
const patch_seen_notification = (id, data) => `UPDATE notifications SET seen = true, status = '${data}' WHERE (id = '${id}')`

module.exports = {
    post_notification,
    get_notifications,
    get_single_notification,
    patch_seen_notification,
    get_sent_notifications
}