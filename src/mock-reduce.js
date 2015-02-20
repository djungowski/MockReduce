MockReduce = function() {
	this._map = new MockReduce.Map();
	this._reduce = new MockReduce.Reduce();
};

MockReduce.prototype._map = null;
MockReduce.prototype._reduce = null;
MockReduce.prototype._nextTestData = null;

MockReduce.prototype.setNextTestData = function (nextTestData) {
	this._nextTestData = nextTestData;
};

MockReduce.prototype.getAndEmptyNextTestData = function () {
	var nextTestData = this._nextTestData;
	this._nextTestData = null;
	return nextTestData
};

MockReduce.prototype.run = function (mapReduce) {
	var testData = this.getAndEmptyNextTestData();
	var mappedData = this._map.run(testData, mapReduce.map);
	this._reduce.run(mappedData, mapReduce.reduce);
};