/**
 * @constructor
 *
 * @param scope
 */
MockReduce.Scope = function(scope) {
	this._scope = scope;
};

/**
 * The scope to expose and conceal variables in
 * Most likely will be window or global
 *
 * @var {object}
 *
 */
MockReduce.Scope.prototype._scope = null;

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

		this._scope[key] = variables[key];
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
		delete this._scope[key];
	}

	this._lastExposedVariables = null;
};