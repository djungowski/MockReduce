/**
 * @constructor
 */
MockReduce.Scope = function() {};

/**
 * The variables that have been exposed last
 *
 * @type {Object}
 * @private
 */
MockReduce.Scope.prototype._lastExposedVariables = null;

/**
 * Expose all provided variables
 *
 * @param variables "{firstkey: 'firstvalue', secondkey: 'secondvalue'}"
 */
MockReduce.Scope.prototype.expose = function (variables) {
	for (var key in variables) {
		if(!variables.hasOwnProperty(key)) {
			continue;
		}

		window[key] = variables[key];
	}
	this._lastExposedVariables = variables;
};

/**
 * Conceal all variables that have been exposed last
 *
 */
MockReduce.Scope.prototype.concealAll = function () {
	for (var key in this._lastExposedVariables) {
		if(!this._lastExposedVariables.hasOwnProperty(key)) {
			continue;
		}
		delete window[key];
	}

	this._lastExposedVariables = null;
};