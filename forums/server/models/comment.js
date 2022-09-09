module.exports = {
	CREATE_COMMENT: 'INSERT INTO comments (`assigned_id`, `user_id`, `created_at`, `body`) VALUES (?, ?, NOW(), ?)',
	ALL_COMMENTS_OF_ID: 'SELECT comments.created_at as comment_creation, users.id as creator_id, users.username as comment_creator, comments.body as comment FROM comments LEFT JOIN users ON comments.user_id = users.id WHERE comments.assigned_id=? ORDER BY comments.created_at DESC'
}