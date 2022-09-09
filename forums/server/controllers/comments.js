var User = require('./../models/user.js');
var Comment = require('./../models/comment.js');

module.exports = {
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

			connection.query(Comment.CREATE_COMMENT, [req.params.id, req.session.access_id, req.body.comment], function(error, rows) {
				connection.release();
				res.json({message: "Successfully posted a comment!"});
			});
		});
	}
}