const get_profile_id = (body) => `SELECT id FROM users WHERE (email = '${body.email}')`

module.exports = {
    get_profile_id
}