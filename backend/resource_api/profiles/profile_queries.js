const post_profile = (body) => `INSERT INTO profiles (first_name, last_name, birthday, gender, custom_gender, pronoun) 
                                VALUES ('${body.first_name}', '${body.last_name}', '${body.birthday}', '${body.gender}', '${body.custom_gender}', '${body.pronoun}');`
const get_single_profile = (id) => `SELECT * FROM profiles WHERE id = '${id}';`
const delete_profile = (id) => `DELETE FROM profiles WHERE ID = '${id}';`
const patch_profile = (body) => `UPDATE profiles 
                                 SET first_name = '${body.first_name}', last_name = '${body.email}', birthday = '${body.birthday}', gender = '${body.gender}', custom_gender = '${body.custom_gender}',
                                     pronoun = '${body.pronoun}' WHERE id = '${body.id}';`

module.exports = {
    post_profile,
    get_single_profile,
    delete_profile,
    patch_profile
}