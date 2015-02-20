MockReduce = function(map, reduce, scope) {
	this._map = map;
	this._reduce = reduce;
	this._scope = scope;
};

/**
 * Instance of MockReduce.Map
 *
 * @type {MockReduce.Map}
 * @private
 */
MockReduce.prototype._map = null;

/**
 * Instance of MockReduce.Reduce
 *
 * @type {MockReduce.Reduce}
 * @private
 */
MockReduce.prototype._reduce = null;

/**
 * Instance of MockReduce.Scope
 *
 * @type {MockReduce.Scope}
 * @private
 */
MockReduce.prototype._scope = null;

/**
 * Data for the next MapReduce call
 *
 * @type {Array}
 * @private
 */
MockReduce.prototype._nextTestData = null;

MockReduce.prototype._installer = null;

/**
 * Initialize a working MockReduce instance
 *
 * @returns {MockReduce}
 */
MockReduce.init = function () {
	var map = new MockReduce.Map(new MockReduce.Scope());
	var reduce = new MockReduce.Reduce();
	var scope = new MockReduce.Scope();
	return new MockReduce(map, reduce, scope);
};

/**
 * Set the data for the next MapReduce call
 *
 * @param nextTestData
 */
MockReduce.prototype.setNextTestData = function (nextTestData) {
	this._nextTestData = nextTestData;
};

/**
 * Get the test data and empty it
 *
 * @returns {Array}
 * @private
 */
MockReduce.prototype._getAndEmptyNextTestData = function () {
	var nextTestData = this._nextTestData;
	this._nextTestData = null;
	return nextTestData
};

/**
 * Run mock reduce for the provided map reduce definition
 *
 * @param mapReduce
 * @param doneCallback
 * @returns {Array}
 */
MockReduce.prototype.run = function (mapReduce, doneCallback) {
	var testData = this._getAndEmptyNextTestData();

	if (testData == null) {
		return [];
	}

	this._scope.expose(mapReduce.scope);
	var mappedData = this._map.run(testData, mapReduce.map);
	var reducedData = this._reduce.run(mappedData, mapReduce.reduce);
	if (typeof mapReduce.finalize == 'function') {
		reducedData = this._reduce.run(reducedData, mapReduce.finalize);
	}
	this._scope.concealAll();

	if (typeof doneCallback == 'function') {
		doneCallback(null, reducedData);
	}

	return reducedData;
};

MockReduce.prototype.mapReduce = function () {
	this.run(arguments[0], arguments[1]);
};

/**
 * Set an installer
 *
 * @param installer
 */
MockReduce.prototype.setInstaller = function(installer) {
	this._installer = installer;
};

/**
 * Run the installer#install method
 *
 * @param connector
 */
MockReduce.prototype.install = function (connector) {
	if (this._installer == null) {
		throw('No installer defined');
	}
	this._installer.install(connector, this);
};

/**
 * Run the installer#uninstall method
 *
 */
MockReduce.prototype.uninstall = function () {
	if (this._installer == null) {
		throw('No installer defined');
	}
	this._installer.uninstall();
};