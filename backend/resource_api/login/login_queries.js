const auth_user = (body) => `SELECT EXISTS (SELECT 1 FROM users WHERE (email = '${body.login}' OR number = '${body.login}') AND password = '${body.password}')`
const get_profile_id = (body) => `SELECT id FROM users WHERE (email = '${body.login}' OR number = '${body.login}')`
module.exports = {
    auth_user,
    get_profile_id
}