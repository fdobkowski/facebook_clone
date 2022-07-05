const post_user = (body) => `INSERT INTO users (id, email, number, password) VALUES ('${body.id}', '${body.email}', '${body.number}', '${body.password}')`

module.exports = {
    post_user
}