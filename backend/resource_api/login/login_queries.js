const auth_user = (body) => `SELECT EXISTS (SELECT 1 FROM users WHERE (email = '${body.username}' OR number = '${body.username}') AND password = '${body.password}')`
module.exports = {
    auth_user
}