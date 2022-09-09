var User = require('./../models/user.js');
var Thread = require('./../models/thread.js');

module.exports = {
	get_recent_activities: function(req, res, pool) {
		pool.getConnection(function(error, connection) {
			if (error) {
				res.json(error);
				return;
			}

			connection.query(Thread.GET_RECENT_REPLIES_WITH_LIMIT, function(error, rows) {
				connection.release();
				res.json(rows);
			});
		});
	},

	get_one: function(req, res, pool) {
		pool.getConnection(function(error, connection) {
			if (error) {
				res.json(error);
				return;
			}

			connection.query(Thread.GET_BY_ID, req.params.id, function(error, rows) {
				var thread = rows[0];
			
				connection.query(Thread.GET_ALL_REPLIES, req.params.id, function(error, rows) {
					connection.release();
					res.json({thread: thread, replies: rows});
				});
			});
		});
	},

	get_all: function(req, res, pool) {
		pool.getConnection(function(error, connection) {
			if (error) {
				res.json(error);
				return;
			}

			var query = Thread.GET_ALL_BY_LAST_REPLY;

			if (req.body.creation_date) {
				query = Thread.GET_ALL_BY_CREATION_DATE;
			}

			connection.query(query, function(error, rows) {
				connection.release();
				res.json(rows);
			});
		});
	},

	create: function(req, res, pool) {
		pool.getConnection(function(error, connection) {
			if (error) {
				res.json(error);
				return;
			}

			if (!req.session || !req.session.access_id) {
				res.json(error);
				connection.release();
				return;
			}

			connection.query(Thread.CREATE_THREAD, [req.session.access_id, req.body.title, req.body.tag, req.body.body], function(error, rows) {
				connection.release();
				res.json({message: "Successfully posted a thread!"});
			});
		});
	},

	get_lastest_announcement: function(req, res, pool) {
		pool.getConnection(function(error, connection) {
			if (error) {
				res.json(error);
				return;
			}

			connection.query(Thread.GET_LATEST_ANNOUNCEMENT, function(error, rows) {
				connection.release();
				res.json(rows[0]);
			});
		});
	},

	post_reply: function(req, res, pool) {
		pool.getConnection(function(error, connection) {
			if (error) {
				res.json(error);
				return;
			}

			if (!req.session || !req.session.access_id) {
				res.json(error);
				connection.release();
				return;
			}

			connection.query(Thread.CREATE_REPLY, [req.session.access_id, req.params.id, req.body.body], function(error, rows) {
				connection.query(Thread.UPDATE_THREAD, req.params.id, function(error, rows) {
					connection.release();
					res.json(rows[0]);
				});
			});
		});
	}
}