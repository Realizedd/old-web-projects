module.exports = {
	diff: function(a, b) {
    	return Math.max(Math.abs(a), Math.abs(b)) - Math.min(Math.abs(a), Math.abs(b));
	},

	dist: function(x1, y1, x2, y2) {
		var dx = x1 - x2;
		var dy = y1 - y2;
		return Math.sqrt(dx * dx + dy * dy);
	},

	values: function(obj, id) {
		var result = [];

		for (var key in obj) {
			if (obj[key].name) {
				if (key == id) {
					result.push(obj[key].clone(key));
				} else {
					result.push(obj[key]);
				}
			}
		}

		return result;
	},

	filter: function(arr, player) {
		var result = [];

		for (var i in arr) {
			if (arr[i].player == player) {
				continue;
			}

			result.push(arr[i]);
		}

		return result;
	},

	randrange: function(min, max) {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}