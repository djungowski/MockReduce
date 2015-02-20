MockReduce = function() {
	this._scope = new MockReduce.Scope();
	this._map = new MockReduce.Map();
	this._reduce = new MockReduce.Reduce();
};

MockReduce.prototype._map = null;
MockReduce.prototype._reduce = null;
MockReduce.prototype._scope = null;
MockReduce.prototype._nextTestData = null;

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

	this._scope.expose(mapReduce.scope);
	var mappedData = this._map.run(testData, mapReduce.map);
	var reducedData = this._reduce.run(mappedData, mapReduce.reduce);
	if (typeof mapReduce.finalize == 'function') {
		this._reduce.run(reducedData, mapReduce.finalize);
	}
	this._scope.concealAll();
};