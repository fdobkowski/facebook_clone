const post_profile = (body) => `INSERT INTO profiles (id, first_name, last_name, birthday, gender, custom_gender, pronoun) 
                                VALUES ('${body.id}', '${body.first_name}', '${body.last_name}', '${body.birthday}', '${body.gender}', '${body.custom_gender}', '${body.pronoun}');`
const get_single_profile = (id) => `SELECT * FROM profiles WHERE id = '${id}';`
const get_all_profiles = `SELECT * FROM profiles;`
const delete_profile = (id) => `DELETE FROM profiles WHERE ID = '${id}';`
const patch_profile = (body) => `UPDATE profiles 
                                 SET first_name = '${body.first_name}', last_name = '${body.email}', birthday = '${body.birthday}', gender = '${body.gender}', custom_gender = '${body.custom_gender}',
                                     pronoun = '${body.pronoun}' WHERE id = '${body.id}';`

module.exports = {
    post_profile,
    get_all_profiles,
    get_single_profile,
    delete_profile,
    patch_profile
}