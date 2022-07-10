const auth_user = (body) => `SELECT id, password FROM users WHERE (email = '${body.login}' OR number = '${body.login}');`
const get_profile_id = (body) => `SELECT id FROM users WHERE (email = '${body.login}' OR number = '${body.login}');`
const get_profile_name = (id) => `SELECT first_name, last_name FROM profiles WHERE (id = '${id}');`
module.exports = {
    auth_user,
    get_profile_id,
    get_profile_name
}