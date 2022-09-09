module.exports = {
	CREATE: 'INSERT INTO users (`username`, `email`, `pw_hash`, `created_at`, `updated_at`, `group`) VALUES (?, ?, ?, NOW(), NOW(), ?)',
	GET_BY_ID: 'SELECT * FROM users WHERE id = ?',
	GET_BY_EMAIL: 'SELECT * FROM users WHERE email = ?',
	GET_BY_EMAIL_AND_USERNAME: 'SELECT * FROM users WHERE email = ? OR username = ?'
}