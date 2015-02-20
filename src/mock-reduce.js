MockReduce = function(map, reduce, scope) {
	this._map = map;
	this._reduce = reduce;
	this._scope = scope;
};

MockReduce.prototype._map = null;
MockReduce.prototype._reduce = null;
MockReduce.prototype._scope = null;
MockReduce.prototype._nextTestData = null;

MockReduce.init = function () {
	var map = new MockReduce.Map();
	var reduce = new MockReduce.Reduce();
	var scope = new MockReduce.Scope();
	return new MockReduce(map, reduce, scope);
};

MockReduce.prototype.setNextTestData = function (nextTestData) {
	this._nextTestData = nextTestData;
};

MockReduce.prototype._getAndEmptyNextTestData = function () {
	var nextTestData = this._nextTestData;
	this._nextTestData = null;
	return nextTestData
};

MockReduce.prototype.run = function (mapReduce) {
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

	return reducedData;
};