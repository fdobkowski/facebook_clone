const post_user = (body) => `INSERT INTO users (username, email, number, password) VALUES ('${body.username}', '${body.email}', '${body.number}', '${body.password}')`
const get_single_user = (id) => `SELECT * FROM users WHERE id = '${id}';`
const delete_user = (id) => `DELETE FROM users WHERE ID = '${id}';`
const patch_user = (body) => `UPDATE users SET username = '${body.username}', email = '${body.email}', number = '${body.number}', password = '${body.password}' WHERE id = '${body.id}';`

module.exports = {
    post_user,
    get_single_user,
    delete_user,
    patch_user
}