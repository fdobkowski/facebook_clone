const post_user = (body) => `INSERT INTO posts (profile_id, content, date)
                               VALUES ('${body.profile_id}', '${body.content}', '${body.date}');`

const delete_post = (id) => `DELETE FROM posts WHERE id = '${id}';`
const patch_post = (body) => `UPDATE posts 
                              SET content = '${body.content}', date = '${body.date}' WHERE id = '${body.id}'`
const get_single_post = (id) => `SELECT * FROM posts WHERE id = '${id}'`

module.exports = {
    post_user,
    delete_post,
    patch_post,
    get_single_post
}