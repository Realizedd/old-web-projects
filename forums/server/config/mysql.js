var mysql = require('mysql');

var pool = mysql.createPool({
	connectionLimit: 100,
	host: 'localhost',
	user: 'root',
	password: 'root',
	port: 3306,
	database: 'forum'
});

module.exports = pool;