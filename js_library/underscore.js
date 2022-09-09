Array.prototype.removeAt = function(index) {
	if (index < 0 || index >= this.length) {
		return;
	}

	for (var i = index; i < this.length; i++) {
		this[i] = this[i + 1];
	}

	this.pop();
};

var _ = {
	map: function(arr, callback) {
		for (var i = 0; i < arr.length; i++) {
			arr[i] = callback(arr[i]);
		}

		return arr;
	},
   	reduce: function(arr, callback) {
   		for (var i = 0; i < arr.length; i++) {
   			if (i + 1 == arr.length) {
   				break;
   			}

   			var current = arr[i];
   			var next = arr[i + 1];
   			arr[i] = callback(current, next);
   			arr.removeAt(i + 1);
   			i--;
   		}

   		return arr;
   	},
   	find: function(arr, callback) {
   		var matching = [];

   		for (var i = 0; i < arr.length; i++) {
   			if (callback(arr[i])) {
   				matching.push(arr[i]);
   			}
   		}

   		return matching;
   	},
   	filter: function(arr, callback) {
   		for (var i = 0; i < arr.length; i++) {
   			if (!callback(arr[i])) {
   				arr.removeAt(i);
   				i--;
   			}
   		}

   		return arr;
   	},
   	reject: function(arr, callback) {
   		for (var i = 0; i < arr.length; i++) {
   			if (callback(arr[i])) {
   				arr.removeAt(i);
   				i--;
   			}
   		}

   		return arr;
   	}
}

var evens = _.filter([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
var odds = _.reject([1, 2, 3, 4, 5, 6], function(num) { return num % 2 == 0; });
var strings = _.find([1, "a", 3, "b", 5, "c"], function(element) { return typeof(element) == "string"});
var sum = _.reduce([1, 2, 3], function(memo, num) { return memo + num; });
var multi = _.map([1, 2, 3], function(num){ return num * 3; });
console.log(evens);
console.log(odds);
console.log(strings);
console.log(sum);
console.log(multi);