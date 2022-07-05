const post_user = (body) => `INSERT INTO posts (id, profile_id, content, date)
                               VALUES ('${body.id}', '${body.profile_id}', '${body.content}', '${body.date}');`
const get_all_posts = `SELECT * FROM posts`

const delete_post = (id) => `DELETE FROM posts WHERE id = '${id}';`
const patch_post = (body) => `UPDATE posts 
                              SET content = '${body.content}', date = '${body.date}' WHERE id = '${body.id}'`
const get_single_post = (id) => `SELECT * FROM posts WHERE id = '${id}'`

module.exports = {
    post_user,
    get_all_posts,
    delete_post,
    patch_post,
    get_single_post
}