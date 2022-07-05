const post_user = (body) => `INSERT INTO users (email, number, password) VALUES ('${body.email}', '${body.number}', '${body.password}')`

module.exports = {
    post_user
}