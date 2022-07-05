const get_profile_id = (body) => `SELECT id FROM users WHERE (email = '${body.login}' OR number = '${body.login}')`

module.exports = {
    get_profile_id
}