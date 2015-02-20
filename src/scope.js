MockReduce.Scope = function() {};

MockReduce.Scope.prototype.expose = function (variables) {
	for (var key in variables) {
		if(!variables.hasOwnProperty(key)) {
			continue;
		}

		window[key] = variables[key];
	}
};