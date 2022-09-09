var util = {
	diff: function(a, b) {
    	return Math.max(Math.abs(a), Math.abs(b)) - Math.min(Math.abs(a), Math.abs(b));
	},

	dist: function(x1, y1, x2, y2) {
		var dx = x1 - x2;
		var dy = y1 - y2;
		return Math.sqrt(dx * dx + dy * dy);
	},

	sort: function(players) {
		players.sort(function(a, b) {
			return parseInt(b.score) - parseInt(a.score);
		});

		return players;
	}
}