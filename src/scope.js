MockReduce.Scope = function() {};

MockReduce.Scope.prototype._lastExposedVariables = null;

MockReduce.Scope.prototype.expose = function (variables) {
	for (var key in variables) {
		if(!variables.hasOwnProperty(key)) {
			continue;
		}

		window[key] = variables[key];
	}
	this._lastExposedVariables = variables;
};

MockReduce.Scope.prototype.concealAll = function () {
	for (var key in this._lastExposedVariables) {
		if(!this._lastExposedVariables.hasOwnProperty(key)) {
			continue;
		}
		delete window[key];
	}

	this._lastExposedVariables = null;
};